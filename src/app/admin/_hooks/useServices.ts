"use client";

import { useState, useEffect } from "react";
import type { ServiceItem } from "../_lib/types";

export function useServices(isAuthenticated: boolean) {
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    title: "",
    description: "",
    icon: "Building2",
    features: [] as string[],
    order_index: 0,
  });

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services");
      if (response.ok) {
        const data = await response.json();
        setServiceItems(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchServices();
    }
  }, [isAuthenticated]);

  const handleEditService = (item: ServiceItem) => {
    setEditingService(item);
    setIsCreatingService(false);
    setServiceFormData({
      title: item.title,
      description: item.description,
      icon: item.icon,
      features: item.features || [],
      order_index: item.order_index || 0,
    });
  };

  const handleCreateService = () => {
    setEditingService(null);
    setIsCreatingService(true);
    setServiceFormData({ title: "", description: "", icon: "Building2", features: [], order_index: serviceItems.length });
  };

  const handleCancelService = () => {
    setEditingService(null);
    setIsCreatingService(false);
    setServiceFormData({ title: "", description: "", icon: "Building2", features: [], order_index: 0 });
  };

  const handleSaveService = async () => {
    try {
      const method = isCreatingService ? "POST" : "PUT";
      const body = isCreatingService
        ? { ...serviceFormData, id: Date.now().toString() }
        : { ...serviceFormData, id: editingService?.id };

      const response = await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchServices();
        handleCancelService();
      }
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Удалить эту услугу?")) return;

    try {
      const response = await fetch("/api/admin/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return {
    serviceItems,
    editingService,
    isCreatingService,
    serviceFormData,
    setServiceFormData,
    handleEditService,
    handleCreateService,
    handleCancelService,
    handleSaveService,
    handleDeleteService,
  };
}
