"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-12345",
      date: "2023-10-15",
      items: 3,
      total: 1344,
      status: "تم التوصيل",
      statusColor: "text-green-500",
    },
    {
      id: "ORD-12346",
      date: "2023-10-10",
      items: 2,
      total: 899,
      status: "قيد التجهيز",
      statusColor: "text-yellow-500",
    },
    {
      id: "ORD-12347",
      date: "2023-10-05",
      items: 1,
      total: 1299,
      status: "تم الشحن",
      statusColor: "text-blue-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">طلباتي</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>طلب #{order.id}</CardTitle>
                <p className="text-gray-500">{order.date}</p>
              </div>
              <span className={`font-bold ${order.statusColor}`}>
                {order.status}
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p>
                    {order.items} منتج • {order.total.toFixed(2)} ر.س
                  </p>
                </div>
                <Button variant="outline">عرض التفاصيل</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
