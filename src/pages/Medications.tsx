import React, { useState } from 'react';
import { Plus, Search, Pill } from 'lucide-react';
import { MedicationCard } from '../components/Medications/MedicationCard';
import { AddMedicationModal } from '../components/Medications/AddMedicationModal';
import { useMedications } from '../hooks/useMedications';
import { Medication } from '../types';

export const Medications: React.FC = () => {
  const { medications, loading, addMedication, updateMedication, deleteMedication } = useMedications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(medications.map(med => med.category))];
  
  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.family_member?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveMedication = async (medicationData: Omit<Medication, 'id' | 'user_id' | 'created_at'>) => {
    try {
      if (editingMedication) {
        await updateMedication(editingMedication.id, medicationData);
      } else {
        await addMedication(medicationData);
      }
      setIsModalOpen(false);
      setEditingMedication(undefined);
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setIsModalOpen(true);
  };

  const handleDeleteMedication = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await deleteMedication(id);
      } catch (error) {
        console.error('Error deleting medication:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medications</h1>
          <p className="text-gray-600">Manage your medication regimens</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search medications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Medications Grid */}
      {filteredMedications.length === 0 ? (
        <div className="text-center py-12">
          <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {medications.length === 0 ? 'No medications yet' : 'No medications found'}
          </h3>
          <p className="text-gray-500 mb-6">
            {medications.length === 0 
              ? 'Start by adding your first medication to track your adherence'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {medications.length === 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all"
            >
              Add Your First Medication
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onEdit={handleEditMedication}
              onDelete={handleDeleteMedication}
            />
          ))}
        </div>
      )}

      <AddMedicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMedication(undefined);
        }}
        onSave={handleSaveMedication}
        editingMedication={editingMedication}
      />
    </div>
  );
};