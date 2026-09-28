"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Client = {
  id: string;
  name: string;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
};

interface ClientSelectorProps {
  selectedClientId?: string;
  onSelect: (clientId: string) => void;
  onAddNew?: () => void;
  error?: string;
}

export function ClientSelector({ selectedClientId, onSelect, onAddNew, error }: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients");
        const data = await res.json();
        if (data.success) {
          setClients(data.clients);
        }
      } catch (err) {
        console.error("Failed to fetch clients", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Select Client
        </label>
        {onAddNew && (
          <Button type="button" variant="ghost" size="sm" className="h-auto p-0 text-primary" onClick={onAddNew}>
            <Plus className="w-3 h-3 mr-1" />
            Add New Client
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
          Loading clients...
        </div>
      ) : (
        <select
          className={`flex h-10 w-full items-center justify-between rounded-md border ${error ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          value={selectedClientId || ""}
          onChange={(e) => onSelect(e.target.value)}
        >
          <option value="" disabled>Select a client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name} {client.email ? `(${client.email})` : ""}
            </option>
          ))}
        </select>
      )}
      
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
