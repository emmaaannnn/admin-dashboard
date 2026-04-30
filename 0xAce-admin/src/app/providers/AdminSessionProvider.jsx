import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import supabase, { isSupabaseConfigured } from "../../shared/lib/supabaseClient";

const AdminSessionContext = createContext(null);

function formatAuthError(error, fallbackMessage) {
  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

function buildDisplayName(user, profile) {
  const candidates = [
    profile?.full_name,
    user?.user_metadata?.full_name,
    user?.user_metadata?.name,
    user?.email?.split("@")[0],
  ];

  return candidates.find((value) => typeof value === "string" && value.trim()) || "Admin User";
}

function mapAdminUser(user, profile) {
  return {
    id: user.id,
    fullName: buildDisplayName(user, profile),
    email: user.email ?? "",
    role: profile?.role || "admin",
    permissions: Array.isArray(profile?.permissions) ? profile.permissions : [],
    lastActiveAt: user.last_sign_in_at ?? null,
  };
}


function AdminSessionProvider({ children }) {
  const isMountedRef = useRef(true);
  const [session, setSession] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  const applySession = useCallback(async (nextSession) => {
    if (!isMountedRef.current) {
      return { success: false, error: "Session state is no longer available." };
    }

    if (!isSupabaseConfigured) {
      setSession(null);
      setAdminUser(null);
      setIsHydrated(true);
      return {
        success: false,
        error:
          "Supabase auth is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.",
      };
    }

    if (!nextSession?.user) {
      setSession(null);
      setAdminUser(null);
      setIsHydrated(true);
      return { success: true };
    }

    const { data: profile, error } = await supabase
      .from("admin_users")
      .select("user_id, full_name, role, permissions, is_active")
      .eq("user_id", nextSession.user.id)
      .maybeSingle();

    if (error) {
      setSession(null);
      setAdminUser(null);
      setIsHydrated(true);
      return {
        success: false,
        error: formatAuthError(error, "Unable to verify admin access."),
      };
    }

    if (!profile || profile.is_active === false) {
      await supabase.auth.signOut();
      setSession(null);
      setAdminUser(null);
      setIsHydrated(true);
      return {
        success: false,
        error: "Your account does not have access to this admin dashboard.",
      };
    }

    setSession(nextSession);
    setAdminUser(mapAdminUser(nextSession.user, profile));
    setIsHydrated(true);
    return { success: true };
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    if (!isSupabaseConfigured) {
      setAuthError(
        "Supabase auth is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY."
      );
      setIsHydrated(true);
      return () => {
        isMountedRef.current = false;
      };
    }

    let authSubscription;

    const bootstrap = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMountedRef.current) {
        return;
      }

      if (error) {
        setAuthError(formatAuthError(error, "Unable to restore your session."));
        setIsHydrated(true);
        return;
      }

      const result = await applySession(data.session);

      if (isMountedRef.current) {
        setAuthError(result.success ? "" : result.error);
      }
    };

    void bootstrap();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void applySession(nextSession).then((result) => {
        if (isMountedRef.current) {
          setAuthError(result.success ? "" : result.error);
        }
      });
    });

    authSubscription = data?.subscription;

    return () => {
      isMountedRef.current = false;
      authSubscription?.unsubscribe?.();
    };
  }, [applySession]);

  const login = useCallback(async ({ email, password }) => {
    if (!isSupabaseConfigured) {
      const errorMessage =
        "Supabase auth is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.";
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      const errorMessage = formatAuthError(error, "Incorrect email or password.");
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }

    const result = await applySession(data.session);

    if (isMountedRef.current) {
      setAuthError(result.success ? "" : result.error);
    }

    return result;
  }, [applySession]);

  const logout = useCallback(async () => {
    setAuthError("");
    const { error } = await supabase.auth.signOut();

    if (!error && isMountedRef.current) {
      setSession(null);
      setAdminUser(null);
    }

    return { success: !error, error: error ? formatAuthError(error, "Unable to sign out.") : "" };
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session && adminUser),
      isHydrated,
      adminUser,
      authError,
      login,
      logout,
    }),
    [adminUser, authError, isHydrated, login, logout, session]
  );

  return (
    <AdminSessionContext.Provider value={value}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);

  if (!context) {
    throw new Error("useAdminSession must be used within AdminSessionProvider");
  }

  return context;
}

export default AdminSessionProvider;