import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Calendar, CheckCircle, AlertCircle, Phone, Mail, Search, Filter, MapPin, Settings, Save, X, MessageCircle, Clock, UserCheck, Plus, User } from 'lucide-react';

const UpdateServiceModal = ({ isOpen, onClose, customer, onSave }) => {
  const [selectedService, setSelectedService] = useState('');
  const [serviceDate, setServiceDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setServiceDate(today);
      setSelectedService('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!selectedService || !serviceDate) {
      alert('Please select a service slot and a date.');
      return;
    }
    onSave({
      rowIndex: customer.rowIndex,
      serviceColumn: selectedService,
      newDate: serviceDate,
    });
  };

  // Use dynamic service columns from customer data
  const serviceColumns = customer?.serviceColumns || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Update Service for {customer?.name}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Slot</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="" disabled>Select a service slot</option>
              {serviceColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Date</label>
            <input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center">
            <Save size={16} className="mr-2" /> Save Update
          </button>
        </div>
      </div>
    </div>
  );
};

const UpdateContactModal = ({ isOpen, onClose, customer, onSave }) => {
  const [contactStatus, setContactStatus] = useState('');
  const [contactNotes, setContactNotes] = useState('');

  useEffect(() => {
    if (isOpen && customer) {
      setContactStatus(customer.contactStatus || 'not_contacted');
      setContactNotes(customer.contactNotes || '');
    }
  }, [isOpen, customer]);

  if (!isOpen) return null;

  const handleSave = () => {
    const today = new Date().toISOString().split('T')[0];
    onSave({
      rowIndex: customer.rowIndex,
      status: contactStatus,
      contactDate: contactStatus === 'contacted' ? today : null,
      notes: contactNotes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Update Contact Status</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">{customer?.name}</h3>
            <p className="text-sm text-gray-600">{customer?.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Status</label>
            <select
              value={contactStatus}
              onChange={(e) => setContactStatus(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="not_contacted">Not Contacted</option>
              <option value="contacted">Contacted</option>
              <option value="overdue">Overdue (No Response)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={contactNotes}
              onChange={(e) => setContactNotes(e.target.value)}
              placeholder="Add any notes about the contact..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              rows="3"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center">
            <Save size={16} className="mr-2" /> Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

const AddCustomerModal = ({ isOpen, onClose, onSave }) => {
  const [customerData, setCustomerData] = useState({
    name: '',
    address: '',
    phone: '',
    nextService: ''
  });

  useEffect(() => {
    if (isOpen) {
      setCustomerData({
        name: '',
        address: '',
        phone: '',
        nextService: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!customerData.name || !customerData.phone) {
      alert('Please provide at least customer name and phone number.');
      return;
    }
    onSave(customerData);
  };

  const handleInputChange = (field, value) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Customer</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name *</label>
            <input
              type="text"
              value={customerData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
            <input
              type="text"
              value={customerData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={customerData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              rows="2"
              placeholder="Enter customer address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Next Service Date</label>
            <input
              type="date"
              value={customerData.nextService}
              onChange={(e) => handleInputChange('nextService', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center">
            <Plus size={16} className="mr-2" /> Add Customer
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomerServiceApp = () => {
  const [customers, setCustomers] = useState([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sortBy, setSortBy] = useState('nextService');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Listen for data from Electron main process
  useEffect(() => {
    console.log('Checking for electronAPI...', window.electronAPI ? 'Found' : 'Not found');
    console.log('Checking for electronTest...', window.electronTest ? 'Found' : 'Not found');

    if (window.electronAPI) {
      console.log('Setting up Electron API listeners');

      // Listen for successful data load
      window.electronAPI.onDataLoaded((event, data) => {
        console.log('Data received from Google Sheets:', data);
        setCustomers(data);
        setLoading(false);
        setError(null);
      });

      // Listen for data load errors
      window.electronAPI.onDataError((event, errorMessage) => {
        console.error('Error loading data:', errorMessage);
        setError(errorMessage);
        setLoading(false);
      });

      // Test the API
      if (window.electronTest) {
        console.log('Electron test result:', window.electronTest.ping());
      }

      // Cleanup listeners on unmount
      return () => {
        console.log('Cleaning up Electron API listeners');
        window.electronAPI.removeAllListeners('data-loaded');
        window.electronAPI.removeAllListeners('data-error');
      };
    }
  }, []);

  // Refresh data function
  const refreshData = async () => {
    if (window.electronAPI) {
      setLoading(true);
      try {
        const result = await window.electronAPI.refreshData();
        if (result.success) {
          setCustomers(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to refresh data');
      } finally {
        setLoading(false);
      }
    }
  };

  // Monthly reminder system
  useEffect(() => {
    const checkReminders = () => {
      const today = new Date();
      const pendingReminders = customers.filter(customer => {
        if (!customer.nextService) return false;

        const nextServiceDate = new Date(customer.nextService);
        if (isNaN(nextServiceDate.getTime())) return false;

        const daysDiff = Math.ceil((nextServiceDate - today) / (1000 * 60 * 60 * 24));

        // Show reminder if service is due within 30 days or overdue
        return daysDiff <= 30;
      });

      setNotifications(pendingReminders);
    };

    if (customers.length > 0) {
      checkReminders();
      const reminderTimer = setInterval(checkReminders, 60000 * 60 * 24); // Check daily
      return () => clearInterval(reminderTimer);
    }
  }, [customers]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleOpenServiceModal = (customer) => {
    setSelectedCustomer(customer);
    setIsServiceModalOpen(true);
    scrollToTop();
  };

  const handleOpenContactModal = (customer) => {
    setSelectedCustomer(customer);
    setIsContactModalOpen(true);
    scrollToTop();
  };

  const handleOpenAddCustomerModal = () => {
    setIsAddCustomerModalOpen(true);
    scrollToTop();
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleCloseAddCustomerModal = () => {
    setIsAddCustomerModalOpen(false);
  };

  const handleSaveServiceChanges = async (updateInfo) => {
    if (window.electronAPI) {
      const result = await window.electronAPI.updateService(updateInfo);
      if (result.success) {
        alert('Service update successful!');
        handleCloseServiceModal();
        refreshData(); // Refresh data untuk melihat perubahan
      } else {
        alert(`Service update failed: ${result.error}`);
      }
    } else {
      // Demo mode - update local state
      setCustomers(prev => prev.map((customer, index) => {
        if (index === updateInfo.rowIndex) {
          return {
            ...customer,
            services: {
              ...customer.services,
              [updateInfo.serviceColumn]: updateInfo.newDate
            }
          };
        }
        return customer;
      }));
      alert('Service update successful! (Demo mode)');
      handleCloseServiceModal();
    }
  };

  const handleSaveContactChanges = async (updateInfo) => {
    if (window.electronAPI) {
      const result = await window.electronAPI.updateContactStatus(updateInfo);
      if (result.success) {
        alert('Contact status updated successfully!');
        handleCloseContactModal();
        refreshData(); // Refresh data untuk melihat perubahan
      } else {
        alert(`Contact status update failed: ${result.error}`);
      }
    } else {
      // Demo mode - update local state
      setCustomers(prev => prev.map((customer, index) => {
        if (index === updateInfo.rowIndex) {
          return {
            ...customer,
            contactStatus: updateInfo.status,
            contactDate: updateInfo.contactDate,
            contactNotes: updateInfo.notes
          };
        }
        return customer;
      }));
      alert('Contact status updated successfully! (Demo mode)');
      handleCloseContactModal();
    }
  };

  const handleAddCustomer = async (customerData) => {
    if (window.electronAPI) {
      const result = await window.electronAPI.addCustomer(customerData);
      if (result.success) {
        alert('Customer added successfully!');
        handleCloseAddCustomerModal();
        refreshData(); // Refresh data to show new customer
      } else {
        alert(`Failed to add customer: ${result.error}`);
      }
    } else {
      // Demo mode - add to local state
      const newCustomer = {
        ...customerData,
        services: {},
        serviceColumns: ['Service 1', 'Service 2', 'Service 3', 'Service 4'],
        rowIndex: customers.length
      };
      setCustomers(prev => [...prev, newCustomer]);
      alert('Customer added successfully! (Demo mode)');
      handleCloseAddCustomerModal();
    }
  };

  // Call Whatsapp
  const handleCallCustomer = (phoneNumber) => {
    if (window.electronAPI && phoneNumber) {
      window.electronAPI.openWhatsApp(phoneNumber);
      scrollToTop();
    } else if (phoneNumber) {
      // Fallback for demo mode - open WhatsApp web
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanPhone}`, '_blank');
    } else {
      alert('Phone number is not available or Electron API is missing.');
    }
  };

  // Get most recent service from services object
  const getMostRecentService = (services) => {
    if (!services) return null;

    const serviceDates = Object.values(services)
      .filter(date => date && date.trim() !== '')
      .map(date => new Date(date))
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => b - a);

    return serviceDates.length > 0 ? serviceDates[0] : null;
  };

  // Calculate priority based on service history and next service date
  const calculatePriority = (customer) => {
    const today = new Date();
    const nextServiceDate = new Date(customer.nextService);

    if (isNaN(nextServiceDate.getTime())) return 'Low';

    const daysDiff = Math.ceil((nextServiceDate - today) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return 'High'; // Overdue
    if (daysDiff <= 7) return 'High'; // Due within a week
    if (daysDiff <= 30) return 'Medium'; // Due within a month
    return 'Low'; // Future service
  };

  const getPriorityWeight = (customer) => {
    const priority = calculatePriority(customer);
    switch (priority) {
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  };

  // Get contact status display with enhanced visual design
  const getContactStatusDisplay = (customer) => {
    const today = new Date();
    const nextService = new Date(customer.nextService);

    // Auto-update status to overdue if past due date and was contacted
    if (customer.contactStatus === 'contacted' && !isNaN(nextService.getTime()) && nextService < today) {
      return {
        status: 'overdue',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertCircle size={16} />,
        text: 'Overdue - Not Responded',
        pulse: 'animate-pulse'
      };
    }

    switch (customer.contactStatus) {
      case 'contacted':
        return {
          status: 'contacted',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle size={16} />,
          text: 'Contacted',
          pulse: ''
        };
      case 'overdue':
        return {
          status: 'overdue',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertCircle size={16} />,
          text: 'Overdue - Not Responded',
          pulse: 'animate-pulse'
        };
      default:
        return {
          status: 'not_contacted',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Clock size={16} />,
          text: 'Not Contacted',
          pulse: ''
        };
    }
  };

  // Enhanced reminder date display
  const getReminderDisplay = (customer) => {
    if (!customer.nextReminder && !customer.nextService) {
      return {
        text: 'No reminder set',
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        icon: <Calendar size={16} />
      };
    }

    const reminderDate = new Date(customer.nextReminder || customer.nextService);
    const today = new Date();
    const daysDiff = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      return {
        text: `${Math.abs(daysDiff)} days overdue`,
        color: 'text-red-700',
        bgColor: 'bg-red-50 border-l-4 border-red-400',
        icon: <AlertCircle size={16} className="text-red-500" />
      };
    } else if (daysDiff === 0) {
      return {
        text: 'Due today',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50 border-l-4 border-orange-400',
        icon: <Bell size={16} className="text-orange-500 animate-bounce" />
      };
    } else if (daysDiff <= 7) {
      return {
        text: `Due in ${daysDiff} days`,
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50 border-l-4 border-yellow-400',
        icon: <Clock size={16} className="text-yellow-500" />
      };
    } else {
      return {
        text: `Due in ${daysDiff} days`,
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-l-4 border-blue-400',
        icon: <Calendar size={16} className="text-blue-500" />
      };
    }
  };

  const sortedAndFilteredCustomers = customers
    .filter(customer => {
      if (!customer.name) return false;

      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.address && customer.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()));

      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'overdue') {
        const nextServiceDate = new Date(customer.nextService);
        const isOverdue = !isNaN(nextServiceDate.getTime()) && nextServiceDate < new Date();
        return isOverdue && matchesSearch;
      }
      if (filterBy === 'upcoming') {
        const nextServiceDate = new Date(customer.nextService);
        if (isNaN(nextServiceDate.getTime())) return false;
        const daysDiff = Math.ceil((nextServiceDate - new Date()) / (1000 * 60 * 60 * 24));
        return daysDiff > 0 && daysDiff <= 30 && matchesSearch;
      }
      if (filterBy === 'contacted') {
        return customer.contactStatus === 'contacted' && matchesSearch;
      }
      if (filterBy === 'not_contacted') {
        return (!customer.contactStatus || customer.contactStatus === 'not_contacted') && matchesSearch;
      }
      if (filterBy === 'contact_overdue') {
        return customer.contactStatus === 'overdue' && matchesSearch;
      }
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return getPriorityWeight(b) - getPriorityWeight(a);
        case 'nextService':
          const dateA = new Date(a.nextService);
          const dateB = new Date(b.nextService);
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;
          return dateA - dateB;
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'contactStatus':
          const statusA = a.contactStatus || 'not_contacted';
          const statusB = b.contactStatus || 'not_contacted';
          return statusA.localeCompare(statusB);
        default:
          return 0;
      }
    });

  const getServiceStatus = (customer) => {
    if (!customer.nextService) return { status: 'unknown', color: 'text-gray-600', text: 'No service date' };

    const today = new Date();
    const nextServiceDate = new Date(customer.nextService);

    if (isNaN(nextServiceDate.getTime())) return { status: 'unknown', color: 'text-gray-600', text: 'Invalid date' };

    const daysDiff = Math.ceil((nextServiceDate - today) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return { status: 'overdue', color: 'text-red-600', text: `Overdue by ${Math.abs(daysDiff)} days` };
    if (daysDiff <= 7) return { status: 'urgent', color: 'text-orange-600', text: `Due in ${daysDiff} days` };
    if (daysDiff <= 30) return { status: 'upcoming', color: 'text-yellow-600', text: `Due in ${daysDiff} days` };
    return { status: 'scheduled', color: 'text-blue-600', text: `Due in ${daysDiff} days` };
  };

  const getPriorityColor = (customer) => {
    const priority = calculatePriority(customer);
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <UpdateServiceModal
        isOpen={isServiceModalOpen}
        onClose={handleCloseServiceModal}
        customer={selectedCustomer}
        onSave={handleSaveServiceChanges}
      />

      <UpdateContactModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        customer={selectedCustomer}
        onSave={handleSaveContactChanges}
      />

      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={handleCloseAddCustomerModal}
        onSave={handleAddCustomer}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Settings className="mr-3 text-blue-600" />
              Service Water Heater Reminder
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleOpenAddCustomerModal}
                className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="mr-2" size={16} />
                Add Customer
              </button>
              <button
                onClick={refreshData}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Bell className="mr-2" size={16} />
                Refresh
              </button>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2" size={16} />
                Last updated: {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 text-sm font-medium">Total Customers</p>
              <p className="text-2xl font-bold text-blue-900">{customers.length}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-600 text-sm font-medium">Overdue Services</p>
              <p className="text-2xl font-bold text-red-900">
                {customers.filter(c => {
                  const nextServiceDate = new Date(c.nextService);
                  return !isNaN(nextServiceDate.getTime()) && nextServiceDate < new Date();
                }).length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-600 text-sm font-medium">Due This Month</p>
              <p className="text-2xl font-bold text-yellow-900">
                {customers.filter(c => {
                  const nextServiceDate = new Date(c.nextService);
                  if (isNaN(nextServiceDate.getTime())) return false;
                  const daysDiff = Math.ceil((nextServiceDate - new Date()) / (1000 * 60 * 60 * 24));
                  return daysDiff > 0 && daysDiff <= 30;
                }).length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-sm font-medium">Contacted</p>
              <p className="text-2xl font-bold text-green-900">
                {customers.filter(c => c.contactStatus === 'contacted').length}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Not Contacted</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => !c.contactStatus || c.contactStatus === 'not_contacted').length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-purple-600 text-sm font-medium">Contact Overdue</p>
              <p className="text-2xl font-bold text-purple-900">
                {customers.filter(c => c.contactStatus === 'overdue').length}
              </p>
            </div>
          </div>

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="text-red-600 mr-2" size={20} />
                <h3 className="text-red-800 font-semibold">
                  {notifications.length} Customer(s) Need Attention
                </h3>
              </div>
              <p className="text-red-700 text-sm">
                The following customers have services due within 30 days or are overdue.
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <Search className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-64"
              />
            </div>

            <div className="flex items-center">
              <Filter className="text-gray-400 mr-2" size={20} />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Customers</option>
                <option value="overdue">Overdue Services</option>
                <option value="upcoming">Due This Month</option>
                <option value="contacted">Contacted</option>
                <option value="not_contacted">Not Contacted</option>
                <option value="contact_overdue">Contact Overdue</option>
              </select>
            </div>

            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="nextService">Next Service Date</option>
                <option value="priority">Priority</option>
                <option value="name">Customer Name</option>
                <option value="contactStatus">Contact Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="grid gap-4">
          {sortedAndFilteredCustomers.map((customer, index) => {
            const serviceStatus = getServiceStatus(customer);
            const priority = calculatePriority(customer);
            const mostRecentService = getMostRecentService(customer.services);
            const contactStatusDisplay = getContactStatusDisplay(customer);
            const reminderDisplay = getReminderDisplay(customer);

            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">
                        {customer.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(customer)} mr-2`}>
                        {priority} Priority
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${contactStatusDisplay.color} ${contactStatusDisplay.pulse} flex items-center`}>
                        {contactStatusDisplay.icon}
                        <span className="ml-1">{contactStatusDisplay.text}</span>
                      </span>
                    </div>

                    {/* Enhanced Reminder Display */}
                    <div className={`mb-4 p-3 rounded-lg ${reminderDisplay.bgColor}`}>
                      <div className="flex items-center">
                        {reminderDisplay.icon}
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-600">Next Reminder</p>
                          <p className={`font-semibold ${reminderDisplay.color}`}>
                            {customer.nextReminder || customer.nextService
                              ? `${new Date(customer.nextReminder || customer.nextService).toLocaleDateString()} - ${reminderDisplay.text}`
                              : reminderDisplay.text}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {customer.address || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium flex items-center">
                          <Phone size={14} className="mr-1" />
                          {customer.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Last Service</p>
                        <p className="font-medium">
                          {mostRecentService ? mostRecentService.toLocaleDateString() : 'No service recorded'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Next Service</p>
                        <p className="font-medium">
                          {customer.nextService && !isNaN(new Date(customer.nextService).getTime())
                            ? new Date(customer.nextService).toLocaleDateString()
                            : 'Not scheduled'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Service Status</p>
                        <p className={`font-medium ${serviceStatus.color}`}>
                          {serviceStatus.text}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Contact</p>
                        <p className="font-medium">
                          {customer.contactDate
                            ? new Date(customer.contactDate).toLocaleDateString()
                            : 'Never contacted'}
                        </p>
                      </div>
                    </div>

                    {/* Contact Notes */}
                    {customer.contactNotes && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Contact Notes</p>
                        <p className="text-sm bg-gray-50 p-2 rounded">{customer.contactNotes}</p>
                      </div>
                    )}

                    {/* Service History - Dynamic Columns */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Service History</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                        {customer.services && Object.entries(customer.services).map(([key, date]) => (
                          <div key={key} className="text-xs bg-gray-50 p-2 rounded">
                            <span className="text-gray-500 font-medium">{key.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()}:</span>
                            <div className="font-medium mt-1">
                              {date && date.trim() !== '' ? new Date(date).toLocaleDateString('en-GB') : 'Not set'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col items-end">
                    <div className="space-y-2">
                      <button
                        onClick={() => handleCallCustomer(customer.phone)}
                        className="block w-full text-right px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                      >
                        <MessageCircle size={16} className="mr-2" />
                        Contact via WhatsApp
                      </button>
                      <button
                        onClick={() => handleOpenContactModal(customer)}
                        className="block w-full text-right px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center"
                      >
                        <UserCheck size={16} className="mr-2" />
                        Update Contact Status
                      </button>
                      <button
                        onClick={() => handleOpenServiceModal(customer)}
                        className="block w-full text-right px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                      >
                        <Settings size={16} className="mr-2" />
                        Update Service
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sortedAndFilteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No customers match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerServiceApp;