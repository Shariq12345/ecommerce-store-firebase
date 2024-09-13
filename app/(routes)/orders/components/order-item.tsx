import React from "react";
import { Orders } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Package, CreditCard, Truck, CheckCircle, XCircle } from "lucide-react";

interface OrderItemProps {
  order: Orders;
}

const OrderItem = ({ order }: OrderItemProps) => {
  const orderSteps = [
    { status: "Processing", icon: Package, label: "Processing" },
    { status: "Delivering", icon: Truck, label: "Delivering" },
    { status: "Delivered", icon: CheckCircle, label: "Delivered" },
    { status: "Cancelled", icon: XCircle, label: "Cancelled" },
  ];

  const currentStepIndex = orderSteps.findIndex(
    (step) => step.status === order.order_status
  );

  const getProgressWidth = () => {
    if (order.order_status === "Cancelled") return "100%";
    if (currentStepIndex === -1) return "0%";
    return `${(currentStepIndex / (orderSteps.length - 2)) * 100}%`;
  };

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
          {/* Product Images */}
          <div className="flex-shrink-0">
            <div className="flex -space-x-4 overflow-hidden">
              {order.orderItems.slice(0, 3).map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative w-16 h-16 rounded-full border-2 border-white",
                    index > 0 && "-ml-4"
                  )}
                >
                  <Image
                    src={item.images[0].url}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {order.orderItems.length > 3 && (
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 border-2 border-white text-gray-600 font-semibold">
                  +{order.orderItems.length - 3}
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {order.orderItems.map((item) => item.name).join(", ")}
            </h3>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span>
                Qty:{" "}
                {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
              <span>•</span>
              <span>
                Total: ₹{" "}
                {order.orderItems
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col space-y-2 md:items-end">
            <div className="flex items-center space-x-2">
              <Package size={18} />
              <span
                className={cn(
                  "text-sm font-medium py-1 px-2 rounded-full",
                  order.order_status === "Delivering" &&
                    "bg-yellow-100 text-yellow-700",
                  order.order_status === "Processing" &&
                    "bg-blue-100 text-blue-700",
                  order.order_status === "Delivered" &&
                    "bg-green-100 text-green-700",
                  order.order_status === "Cancelled" &&
                    "bg-red-100 text-red-700"
                )}
              >
                {order.order_status}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard size={18} />
              <span
                className={cn(
                  "text-sm font-medium py-1 px-2 rounded-full",
                  order.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                )}
              >
                {order.isPaid ? "Paid" : "Unpaid"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: getProgressWidth() }}
                className={cn(
                  "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500",
                  order.order_status === "Cancelled"
                    ? "bg-red-500"
                    : "bg-blue-500"
                )}
              ></div>
            </div>
            <div className="flex justify-between">
              {orderSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive =
                  index <= currentStepIndex ||
                  order.order_status === "Cancelled";
                const isCancelled =
                  order.order_status === "Cancelled" &&
                  index === orderSteps.length - 1;
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex flex-col items-center",
                      index === 3 && "hidden md:flex"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-full p-2",
                        isActive
                          ? isCancelled
                            ? "bg-red-500 text-white"
                            : "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      )}
                    >
                      <Icon size={16} />
                    </div>
                    <span className="text-xs mt-1 text-center">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItem;
