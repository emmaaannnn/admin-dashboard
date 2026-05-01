import mockSupabaseData from "../../../data/mock/supabaseData";
import { formatDate, formatMoney } from "../../../shared/lib/formatters";

export const ORDER_STATUSES = [
  "unfulfilled",
  "packed",
  "shipped",
  "delivered",
  "returned",
];

const STATUS_LABELS = {
  unfulfilled: "Unfulfilled",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  returned: "Returned",
};

function parseAddress(addressJson) {
  if (!addressJson) {
    return null;
  }

  try {
    return JSON.parse(addressJson);
  } catch {
    return null;
  }
}

function buildAddressSummary(address) {
  if (!address) {
    return "No shipping address";
  }

  return [address.city, address.state, address.country].filter(Boolean).join(", ");
}

function buildFullAddress(address) {
  if (!address) {
    return "No shipping address available.";
  }

  return [
    address.line1,
    address.line2,
    [address.city, address.state, address.postal_code].filter(Boolean).join(" "),
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function groupItemsByOrder() {
  return mockSupabaseData.order_items.reduce((itemsByOrderId, item) => {
    const items = itemsByOrderId.get(item.order_id) ?? [];

    items.push({
      ...item,
      lineTotalFormatted: formatMoney(item.line_total_aud),
      unitPriceFormatted: formatMoney(item.unit_price_aud),
    });
    itemsByOrderId.set(item.order_id, items);
    return itemsByOrderId;
  }, new Map());
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

export function getOrders() {
  const itemsByOrderId = groupItemsByOrder();

  return [...mockSupabaseData.orders]
    .sort((left, right) => new Date(right.created_at) - new Date(left.created_at))
    .map((order) => {
      const items = itemsByOrderId.get(order.id) ?? [];
      const shippingAddress = parseAddress(order.shipping_address_json);
      const itemCount = items.reduce((total, item) => total + item.quantity, 0);
      const shortId = order.id.slice(0, 8).toUpperCase();

      return {
        ...order,
        items,
        shortId,
        itemCount,
        leadItem: items[0]?.product_name ?? "No items",
        itemPreview: items.length
          ? items
              .slice(0, 2)
              .map((item) => `${item.product_name}${item.variant_label ? ` (${item.variant_label})` : ""}`)
              .join(" • ")
          : "No items",
        createdAtFormatted: formatDate(order.created_at),
        shippedAtFormatted: order.shipped_at ? formatDate(order.shipped_at) : "Not shipped",
        receiptSentAtFormatted: order.receipt_sent_at ? formatDate(order.receipt_sent_at) : "Pending",
        subtotalFormatted: formatMoney(order.subtotal_aud),
        shippingFormatted: formatMoney(order.shipping_aud),
        totalFormatted: formatMoney(order.total_aud),
        shippingAddress,
        shippingAddressSummary: buildAddressSummary(shippingAddress),
        shippingAddressFull: buildFullAddress(shippingAddress),
        statusLabel: getStatusLabel(order.fulfillment_status),
      };
    });
}

export function getOrderById(orderId) {
  return getOrders().find((order) => order.id === orderId) ?? null;
}

export function matchesOrderSearch(order, query) {
  return [
    order.id,
    order.shortId,
    order.shipping_name,
    order.customer_email,
    order.fulfillment_status,
    order.statusLabel,
    order.shippingAddressSummary,
    ...order.items.flatMap((item) => [item.product_name, item.variant_label, item.sku]),
  ]
    .join(" ")
    .toLowerCase()
    .includes(query);
}