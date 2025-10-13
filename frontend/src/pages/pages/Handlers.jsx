import React, { useState, useEffect } from 'react';
import { getAllLivestock } from '../../api/livestockAPI';
import { getAllAnimals } from '../../api/animalAPI';
import { Users, Shield, Heart, Calendar, Stethoscope, Scale, Baby, UserPlus, UserX, Download } from 'lucide-react';

export default function Handlers() {
  const [handlers, setHandlers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHandler, setSelectedHandler] = useState(null);
  const [activeTab, setActiveTab] = useState('handlers');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [handlersResponse, animalsResponse] = await Promise.all([
        getAllLivestock(),
        getAllAnimals()
      ]);
      setHandlers(handlersResponse.data);
      setAnimals(animalsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create 1:1 mapping between handlers and animals
  const getHandlerAnimalMapping = () => {
    const mapping = {};
    const usedAnimals = new Set();
    
    // First, assign animals to handlers based on some logic
    // For now, we'll assign sequentially
    handlers.forEach((handler, index) => {
      if (index < animals.length) {
        mapping[handler.handler_id] = animals[index];
        usedAnimals.add(animals[index].animal_id);
      } else {
        mapping[handler.handler_id] = null;
      }
    });
    
    return { mapping, usedAnimals };
  };

  const { mapping: handlerAnimalMapping, usedAnimals } = getHandlerAnimalMapping();

  // Get the animal assigned to a specific handler
  const getHandlerAnimal = (handlerId) => {
    return handlerAnimalMapping[handlerId] || null;
  };

  // Get available handlers (without animals)
  const getAvailableHandlers = () => {
    return handlers.filter(handler => !handlerAnimalMapping[handler.handler_id]);
  };

  // Get available animals (without handlers)
  const getAvailableAnimals = () => {
    return animals.filter(animal => !usedAnimals.has(animal.animal_id));
  };

  // Calculate statistics
  const totalHandlers = handlers.length;
  const totalAnimals = animals.length;
  const assignedHandlers = handlers.filter(handler => handlerAnimalMapping[handler.handler_id]).length;
  const availableHandlers = totalHandlers - assignedHandlers;
  const assignedAnimals = usedAnimals.size;
  const availableAnimals = totalAnimals - assignedAnimals;
  const differentSpecies = [...new Set(animals.map(a => a.species))].length;
  const healthyAnimals = animals.filter(a => 
    a.healthRecord && !a.healthRecord.toLowerCase().includes('sick')
  ).length;

  // PDF Generator without external libraries
  const generatePDF = () => {
    // Create a printable HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Farm Management Report</title>
        <style>
          @media print {
            @page { margin: 1cm; }
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.4;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .header { 
              text-align: center; 
              margin-bottom: 2cm;
              border-bottom: 2px solid #333;
              padding-bottom: 0.5cm;
            }
            .stats-grid { 
              display: grid; 
              grid-template-columns: repeat(2, 1fr); 
              gap: 0.5cm; 
              margin-bottom: 1cm;
            }
            .stat-card { 
              border: 1px solid #ddd; 
              padding: 0.5cm; 
              border-radius: 0.3cm;
              background: #f9f9f9;
            }
            .section { 
              margin: 1cm 0; 
              page-break-inside: avoid;
            }
            .section-title { 
              background: #333; 
              color: white; 
              padding: 0.3cm; 
              margin-bottom: 0.5cm;
              border-radius: 0.2cm;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 0.5cm;
              font-size: 12px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 0.3cm; 
              text-align: left;
            }
            th { 
              background: #f0f0f0; 
              font-weight: bold;
            }
            .no-break { 
              page-break-inside: avoid;
            }
            .footer {
              margin-top: 2cm;
              text-align: center;
              font-size: 0.8em;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 0.5cm;
            }
            h1 { margin: 0; font-size: 24px; }
            h2 { margin: 0; font-size: 20px; }
            h3 { margin: 0; font-size: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Farm Management Team Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>1 Handler : 1 Animal - Dedicated Care System</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <strong>Total Handlers:</strong> ${totalHandlers}<br>
            <small>Assigned: ${assignedHandlers} • Available: ${availableHandlers}</small>
          </div>
          <div class="stat-card">
            <strong>Total Animals:</strong> ${totalAnimals}<br>
            <small>Assigned: ${assignedAnimals} • Available: ${availableAnimals}</small>
          </div>
          <div class="stat-card">
            <strong>Perfect Matches:</strong> ${Math.min(assignedHandlers, assignedAnimals)}
          </div>
          <div class="stat-card">
            <strong>Healthy Animals:</strong> ${healthyAnimals}<br>
            <small>${((healthyAnimals / totalAnimals) * 100).toFixed(1)}% of total</small>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Handler Details</div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Assigned Animal</th>
              </tr>
            </thead>
            <tbody>
              ${handlers.map(handler => {
                const animal = getHandlerAnimal(handler.handler_id);
                return `
                  <tr>
                    <td>${handler.handler_id}</td>
                    <td>${handler.firstName} ${handler.lastName}</td>
                    <td>${handler.email}</td>
                    <td>${handler.contact_No || 'N/A'}</td>
                    <td>${animal ? 'Assigned' : 'Available'}</td>
                    <td>${animal ? `${animal.species} (ID: ${animal.animal_id})` : 'None'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Animal Details</div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Species</th>
                <th>Health Record</th>
                <th>Breeding Details</th>
                <th>Date of Birth</th>
                <th>Assigned Handler</th>
              </tr>
            </thead>
            <tbody>
              ${animals.map(animal => {
                const handler = handlers.find(h => 
                  handlerAnimalMapping[h.handler_id]?.animal_id === animal.animal_id
                );
                return `
                  <tr>
                    <td>${animal.animal_id}</td>
                    <td>${animal.species}</td>
                    <td>${animal.healthRecord}</td>
                    <td>${animal.breedingDetails}</td>
                    <td>${animal.dateOfBirth ? new Date(animal.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                    <td>${handler ? `${handler.firstName} ${handler.lastName}` : 'None'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="section no-break">
          <div class="section-title">Assignment Summary</div>
          <table>
            <thead>
              <tr>
                <th>Handler Name</th>
                <th>Handler ID</th>
                <th>Animal Species</th>
                <th>Animal ID</th>
                <th>Assignment Status</th>
              </tr>
            </thead>
            <tbody>
              ${handlers.map(handler => {
                const animal = getHandlerAnimal(handler.handler_id);
                return `
                  <tr>
                    <td>${handler.firstName} ${handler.lastName}</td>
                    <td>${handler.handler_id}</td>
                    <td>${animal ? animal.species : 'N/A'}</td>
                    <td>${animal ? animal.animal_id : 'N/A'}</td>
                    <td>${animal ? 'Assigned' : 'Unassigned'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>Farm Management System Report • Generated automatically</p>
          <p>Total Records: ${handlers.length} handlers, ${animals.length} animals</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  // Alternative PDF generation using browser's print functionality with custom styling
  const generateSimplePDF = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Farm Management Report</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 2cm;
            line-height: 1.4;
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 1cm;
            border-bottom: 2px solid #333;
            padding-bottom: 0.5cm;
          }
          .summary { 
            background: #f5f5f5; 
            padding: 1cm; 
            margin: 1cm 0;
            border-radius: 0.5cm;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 1cm 0;
            font-size: 12px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 0.5cm; 
            text-align: left;
          }
          th { 
            background: #333; 
            color: white;
          }
          .footer {
            margin-top: 2cm;
            text-align: center;
            font-style: italic;
            color: #666;
          }
          @media print {
            @page { margin: 1cm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Farm Management Team Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <h3>Quick Summary</h3>
          <p><strong>Handlers:</strong> ${totalHandlers} total, ${assignedHandlers} assigned, ${availableHandlers} available</p>
          <p><strong>Animals:</strong> ${totalAnimals} total, ${assignedAnimals} assigned, ${availableAnimals} available</p>
          <p><strong>Healthy Animals:</strong> ${healthyAnimals} (${((healthyAnimals / totalAnimals) * 100).toFixed(1)}%)</p>
          <p><strong>Different Species:</strong> ${differentSpecies}</p>
        </div>

        <h3>Handler Assignments</h3>
        <table>
          <thead>
            <tr>
              <th>Handler</th>
              <th>Contact</th>
              <th>Assigned Animal</th>
              <th>Animal Health</th>
            </tr>
          </thead>
          <tbody>
            ${handlers.map(handler => {
              const animal = getHandlerAnimal(handler.handler_id);
              return `
                <tr>
                  <td>${handler.firstName} ${handler.lastName}<br><small>ID: ${handler.handler_id}</small></td>
                  <td>${handler.email}<br>${handler.contact_No || 'No contact'}</td>
                  <td>${animal ? `${animal.species} (ID: ${animal.animal_id})` : 'Not assigned'}</td>
                  <td>${animal ? animal.healthRecord : 'N/A'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>End of report - Farm Management System</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Add delay to ensure content is fully loaded
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-blue-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-blue-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto" id="handlers-content">
        {/* Header with PDF Button */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-4">
            Farm Management Team
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            1 Handler : 1 Animal - Dedicated care for each animal by our expert handlers
          </p>
          
          {/* PDF Generation Buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={generatePDF}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Download className="w-5 h-5 mr-2" />
              Generate Full Report
            </button>
            <button
              onClick={generateSimplePDF}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Download className="w-5 h-5 mr-2" />
              Quick Summary
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Handlers</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">{totalHandlers}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {assignedHandlers} assigned • {availableHandlers} available
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Animals</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{totalAnimals}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {assignedAnimals} assigned • {availableAnimals} available
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Perfect Matches</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{Math.min(assignedHandlers, assignedAnimals)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Handler-Animal pairs
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Healthy Animals</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{healthyAnimals}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((healthyAnimals / totalAnimals) * 100).toFixed(1)}% of total
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-2 mb-8 border border-white/20">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('handlers')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'handlers'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-blue-50'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Handlers ({totalHandlers})
            </button>
            <button
              onClick={() => setActiveTab('animals')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'animals'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-green-50'
              }`}
            >
              <Heart className="w-5 h-5 inline mr-2" />
              Animals ({totalAnimals})
            </button>
          </div>
        </div>

        {/* Handlers Tab */}
        {activeTab === 'handlers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {handlers.map((handler) => {
              const assignedAnimal = getHandlerAnimal(handler.handler_id);
              const isAvailable = !assignedAnimal;
              
              return (
                <div
                  key={handler.handler_id}
                  className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${
                    isAvailable ? 'border-yellow-300' : 'border-green-300'
                  } cursor-pointer`}
                  onClick={() => setSelectedHandler(selectedHandler?.handler_id === handler.handler_id ? null : handler)}
                >
                  {/* Card Header */}
                  <div className={`p-6 ${
                    isAvailable 
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-600'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          {isAvailable ? <UserPlus className="w-6 h-6 text-white" /> : <Users className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {handler.firstName} {handler.lastName}
                          </h3>
                          <p className="text-white/90 text-sm">Handler ID: {handler.handler_id}</p>
                        </div>
                      </div>
                      {isAvailable && (
                        <span className="px-2 py-1 bg-white/20 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                          Available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{handler.email}</span>
                      </div>
                      
                      {handler.contact_No && (
                        <div className="flex items-center space-x-3 text-gray-600">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-sm">{handler.contact_No}</span>
                        </div>
                      )}

                      {/* Animal Assignment Status */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Heart className={`w-4 h-4 ${isAvailable ? 'text-yellow-600' : 'text-green-600'}`} />
                            <span className="font-semibold text-gray-700">
                              {isAvailable ? 'Available for Assignment' : 'Assigned Animal'}
                            </span>
                          </div>
                          {!isAvailable && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                              Assigned
                            </span>
                          )}
                        </div>
                        {assignedAnimal && (
                          <p className="text-xs text-gray-500 mt-2">
                            Currently caring for: {assignedAnimal.species}
                          </p>
                        )}
                        {isAvailable && (
                          <p className="text-xs text-yellow-600 mt-2">
                            Ready to be assigned to an animal
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Animals Tab */}
        {activeTab === 'animals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {animals.map((animal) => {
              const isAssigned = usedAnimals.has(animal.animal_id);
              const assignedHandler = handlers.find(handler => 
                handlerAnimalMapping[handler.handler_id]?.animal_id === animal.animal_id
              );
              
              return (
                <div
                  key={animal.animal_id}
                  className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${
                    isAssigned ? 'border-green-300' : 'border-yellow-300'
                  }`}
                >
                  {/* Card Header */}
                  <div className={`p-6 ${
                    isAssigned 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-r from-yellow-400 to-amber-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{animal.species}</h3>
                          <p className="text-white/90 text-sm">ID: {animal.animal_id}</p>
                        </div>
                      </div>
                      {!isAssigned && (
                        <span className="px-2 py-1 bg-white/20 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                          Needs Handler
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {/* Handler Assignment */}
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Users className={`w-4 h-4 ${isAssigned ? 'text-green-500' : 'text-yellow-500'}`} />
                        <div>
                          <p className="text-sm font-semibold">Handler</p>
                          <p className="text-sm">
                            {isAssigned 
                              ? `${assignedHandler.firstName} ${assignedHandler.lastName}`
                              : 'Not assigned'
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-gray-600">
                        <Baby className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-sm font-semibold">Breeding Status</p>
                          <p className="text-sm">{animal.breedingDetails}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-gray-600">
                        <Stethoscope className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-sm font-semibold">Health Record</p>
                          <p className="text-sm">{animal.healthRecord}</p>
                        </div>
                      </div>

                      {animal.dateOfBirth && (
                        <div className="flex items-center space-x-3 text-gray-600">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="text-sm font-semibold">Date of Birth</p>
                            <p className="text-sm">{new Date(animal.dateOfBirth).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Handler Details */}
        {selectedHandler && activeTab === 'handlers' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-12 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedHandler.firstName} {selectedHandler.lastName}
                  </h2>
                  <p className="text-gray-600">Handler ID: {selectedHandler.handler_id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedHandler(null)}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Close Details
              </button>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email</p>
                    <p className="text-lg font-medium text-gray-800">{selectedHandler.email}</p>
                  </div>
                </div>
              </div>

              {selectedHandler.contact_No && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phone</p>
                      <p className="text-lg font-medium text-gray-800">{selectedHandler.contact_No}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Assigned Animal Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Assigned Animal</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  getHandlerAnimal(selectedHandler.handler_id) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-yellow-500 text-white'
                }`}>
                  {getHandlerAnimal(selectedHandler.handler_id) ? 'Assigned' : 'Not Assigned'}
                </span>
              </div>

              {getHandlerAnimal(selectedHandler.handler_id) ? (
                <div className="grid grid-cols-1 gap-6">
                  <div className="group bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 border border-green-200 hover:border-green-300 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-lg text-green-800 group-hover:text-green-700 transition-colors">
                        {getHandlerAnimal(selectedHandler.handler_id).species}
                      </h4>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-semibold">
                        {getHandlerAnimal(selectedHandler.handler_id).animal_id}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-green-100">
                        <span className="text-sm text-gray-600">Health</span>
                        <span className="font-semibold text-gray-800">{getHandlerAnimal(selectedHandler.handler_id).healthRecord}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-green-100">
                        <span className="text-sm text-gray-600">Breeding</span>
                        <span className="font-semibold text-gray-800">{getHandlerAnimal(selectedHandler.handler_id).breedingDetails}</span>
                      </div>
                      {getHandlerAnimal(selectedHandler.handler_id).dateOfBirth && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-600">Date of Birth</span>
                          <span className="font-semibold text-gray-800">
                            {new Date(getHandlerAnimal(selectedHandler.handler_id).dateOfBirth).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-2 border-dashed border-yellow-300">
                  <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserX className="w-10 h-10 text-yellow-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-yellow-700 mb-2">No Animal Assigned</h4>
                  <p className="text-yellow-600 max-w-sm mx-auto">
                    This handler is available and ready to be assigned to an animal.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}