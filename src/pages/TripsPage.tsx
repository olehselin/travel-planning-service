import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { hasPermission } from "@/lib/permissions";
import { useTrips } from "@/hooks/useTrips";
import { filterTrips } from "@/lib/utils/searchUtils";
import { TripCard } from "@/components/trips/TripCard";
import { CreateTripForm } from "@/components/trips/CreateTripForm";
import { TripSearch } from "@/components/trips/TripSearch";
import { EmptyState } from "@/components/trips/EmptyState";

export const TripsPage: React.FC = () => {
  const { user } = useAuth();
  const { trips, loadTrips, isLoading } = useTrips();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (user) {
      loadTrips();
    }
  }, [user, loadTrips]);

  const filteredTrips = filterTrips(trips, searchTerm);
  const canCreateTrip = user ? hasPermission("trip.create", { user }) : false;

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadTrips();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground">
            Manage and organize your travel plans
          </p>
        </div>
        
      </div>

      {/* Search */}
      <TripSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Create Form */}
      {showCreateForm && (
        <CreateTripForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Trips Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading trips...</p>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onEdit={() => setShowCreateForm(true)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          searchTerm={searchTerm}
          onCreateTrip={() => setShowCreateForm(true)}
          canCreateTrip={canCreateTrip}
        />
      )}
    </div>
  );
};
