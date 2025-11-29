import React, { useContext, useMemo, useState, useEffect } from 'react';
import { AppContext } from '../App.jsx';
import { apiService } from '../services/api';

const GuideModal = ({ isOpen, onClose, guide }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900">{guide?.title} - Detailed Guide</h2>
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Overview</h3>
              <p className="text-slate-700">{guide?.overview || 'No overview available.'}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Steps</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-700">
                {guide?.steps?.map((step, index) => (
                  <li key={index} className="mb-1">{step}</li>
                )) || <li>No steps provided.</li>}
              </ol>
            </div>

            {guide?.materials && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Materials Needed</h3>
                <ul className="list-disc list-inside text-slate-700">
                  {guide.materials.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Estimated Cost</h3>
                <p className="text-slate-700">
                  ₹{guide?.costRange?.min?.toLocaleString()} - ₹{guide?.costRange?.max?.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Time Required</h3>
                <p className="text-slate-700">{guide?.timeRequired || 'Varies'}</p>
              </div>
            </div>

            {guide?.tips && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Pro Tips</h3>
                <ul className="list-disc list-inside text-blue-700">
                  {guide.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getGuideForRecommendation = (item) => {
  const guides = {
    'modular-kitchen': {
      title: 'Modular Kitchen Upgrade',
      overview: 'Transform your kitchen with efficient storage solutions and modern aesthetics using this comprehensive guide to modular kitchen installation.',
      steps: [
        'Measure your kitchen space and create a layout plan (L-shaped, U-shaped, or parallel)',
        'Choose materials: Consider BWP (Boiling Water Proof) plywood for cabinets and quartz/granite for countertops',
        'Select hardware: Opt for soft-close hinges and full-extension drawer slides',
        'Plan electrical points: Dedicated circuits for heavy appliances (15A sockets)',
        'Install base cabinets first, ensuring proper leveling',
        'Mount wall units at 54-60 inches from the floor',
        'Install countertops with proper overhang (1-1.5 inches)',
        'Fix backsplash (minimum 4 inches above countertop)',
        'Install sink, faucet, and appliances',
        'Add lighting: Under-cabinet LED strips and overhead task lighting'
      ],
      materials: [
        'BWP Plywood (19mm for cabinets, 12mm for shutters)',
        'Hardware (hinges, drawer runners, handles)',
        'Quartz/Granite countertop (25-30mm thickness)',
        'Ceramic/Porcelain tiles for backsplash',
        'Sink and water purifier system',
        'Chimney (1000-1500 CFM for Indian cooking)',
        'Modular accessories (carousels, pull-outs, baskets)'
      ],
      timeRequired: '3-4 weeks',
      tips: [
        'Maintain a work triangle (sink-stove-refrigerator) with sides between 4-9 feet',
        'Opt for 600mm deep base cabinets and 300mm deep wall cabinets',
        'Include at least 36 inches of countertop workspace',
        'Plan for 18 inches of counter space on both sides of the cooktop',
        'Choose easy-to-clean, anti-bacterial laminate finishes'
      ]
    },
    'smart-home': {
      title: 'Smart Home Automation',
      overview: 'Upgrade your home with intelligent automation for enhanced security, energy efficiency, and convenience.',
      steps: [
        'Create a smart home network with a robust Wi-Fi 6 mesh system',
        'Install smart switches and dimmers (compatible with your ecosystem)',
        'Set up smart lighting with motion sensors and scheduling',
        'Install smart door locks and video doorbells',
        'Configure smart plugs for appliances',
        'Install smart thermostats and AC controllers',
        'Set up security cameras and sensors',
        'Create automation routines (Good Morning, Away Mode, etc.)',
        'Integrate with voice assistants (Google Home/Amazon Alexa)'
      ],
      materials: [
        'Mesh Wi-Fi system (minimum 2-3 nodes)',
        'Smart bulbs/switches (Zigbee/Z-Wave for reliability)',
        'Smart door lock (fingerprint + PIN + RFID)',
        'Video doorbell (1080p or higher)',
        'Smart thermostat (compatible with your HVAC)',
        'Smart plugs with energy monitoring',
        'Security cameras (indoor/outdoor, 2K resolution)',
        'Smart sensors (door/window, motion, water leak)'
      ],
      timeRequired: '2-3 days',
      tips: [
        'Use a separate 2.4GHz network for IoT devices',
        'Choose devices with local control to maintain functionality without internet',
        'Implement VLANs for network segmentation',
        'Regularly update device firmware',
        'Use strong, unique passwords for all devices'
      ]
    },
    'bathroom-upgrade': {
      title: 'Bathroom Renovation Guide',
      overview: 'Transform your bathroom into a modern, functional space with this comprehensive renovation guide.',
      steps: [
        'Demolish existing fixtures carefully to avoid damaging plumbing',
        'Waterproofing: Apply liquid membrane on floors and walls (up to 6 feet)',
        'Install new plumbing lines and drainage with proper slope (1/4 inch per foot)',
        'Lay anti-skid floor tiles (preferably matte finish, 2x2 feet)',
        'Install wall tiles (8x4 feet large format tiles recommended)',
        'Fix sanitaryware with proper water sealing',
        'Install shower enclosure or glass partition',
        'Set up proper ventilation (exhaust fan with 50-80 CFM capacity)',
        'Install fittings and fixtures with proper waterproofing'
      ],
      materials: [
        'Vitrified/Porcelain tiles (anti-skid for floor)',
        'Waterproofing membrane and tape',
        'CPVC/PPR pipes for plumbing',
        'Waterproof LED lights (IP65 rated)',
        'Wall-hung WC with concealed cistern',
        'Wall-mounted faucets and shower system',
        'Shower enclosure (8mm tempered glass)',
        'Exhaust fan with humidity sensor'
      ],
      timeRequired: '3-4 weeks',
      tips: [
        'Maintain minimum clear floor space of 30x30 inches in front of fixtures',
        'Install anti-scald valves for showers (max 49°C)',
        'Use large format tiles to minimize grout lines',
        'Include at least one GFCI protected outlet near the sink',
        'Opt for wall-hung fixtures for easier cleaning'
      ]
    },
    'solar-panels': {
      title: 'Solar Panel Installation',
      overview: 'Harness solar energy to reduce electricity bills and increase property value with this installation guide.',
      steps: [
        'Conduct a site survey and shadow analysis',
        'Calculate energy requirements (average 8-10 kWh per day for a 2BHK)',
        'Obtain necessary permits and approvals (DISCOM, MNRE)',
        'Install mounting structure (roof/wall/ground)',
        'Install solar panels with proper tilt (equal to latitude for optimal output)',
        'Set up inverter and battery bank (if off-grid/hybrid)',
        'Connect to grid (for on-grid systems)',
        'Install net meter and protection devices',
        'Commission and test the system'
      ],
      materials: [
        'Monocrystalline solar panels (330Wp or higher)',
        'Solar inverter (hybrid/on-grid as per requirement)',
        'Mounting structure (galvanized iron/aluminum)',
        'DC/AC cables and combiner boxes',
        'Lightning arrestor and surge protection',
        'Net meter (provided by DISCOM)',
        'Battery bank (for off-grid/hybrid systems)'
      ],
      timeRequired: '7-10 days',
      tips: [
        'Ensure minimum 5-6 hours of direct sunlight on panels',
        'Clean panels every 2 weeks for optimal performance',
        'Monitor system performance through mobile apps',
        'Consider net metering to sell excess power',
        'Regularly check connections and wiring'
      ]
    },
    'paint-refresh': {
      title: 'Interior Painting Guide',
      overview: 'Refresh your home with a new coat of paint using this comprehensive interior painting guide.',
      steps: [
        'Remove furniture and cover floors with drop cloths',
        'Clean walls with TSP (Trisodium Phosphate) solution',
        'Repair cracks and holes with putty, then sand smooth',
        'Apply primer to ensure proper paint adhesion',
        'Cut in edges with an angled brush (2-3 inch)',
        'Roll paint onto walls using W or M patterns',
        'Apply second coat after 4-6 hours',
        'Clean up and remove painter\'s tape before paint dries completely'
      ],
      materials: [
        'Premium emulsion paint (matte/satin finish)',
        'Acrylic putty for wall preparation',
        'Primer (water-based for new walls, oil-based for stains)', 
        'Painter\'s tape (3M or equivalent)',
        'Roller frames and covers (3/8" to 1/2" nap)',
        'Angled sash brush (2-3 inch)',
        'Paint tray and liners',
        'Drop cloths and plastic sheeting'
      ],
      timeRequired: '3-5 days (for standard 2BHK)',
      tips: [
        'Choose low-VOC or zero-VOC paints for better indoor air quality',
        'Maintain consistent lighting while painting to spot missed areas',
        'Use the "W" or "M" technique for even roller application',
        'Keep a wet edge to avoid lap marks',
        'Store leftover paint in airtight containers for touch-ups'
      ]
    },
    'led-lights': {
      title: 'LED Lighting Upgrade',
      overview: 'Upgrade to energy-efficient LED lighting with this comprehensive guide to modern home illumination.',
      steps: [
        'Audit existing lighting and create a lighting plan',
        'Choose appropriate color temperature (2700K-3000K for warm white, 4000K+ for cool white)',
        'Calculate required lumens (general lighting: 20 lumens/sq.ft)',
        'Install dimmer switches compatible with LED bulbs',
        'Replace existing fixtures with LED alternatives',
        'Add task lighting in workspaces (kitchen counters, study tables)',
        'Install motion sensors in low-traffic areas',
        'Set up smart lighting controls and automation'
      ],
      materials: [
        'LED bulbs (9-12W for 60W equivalent)',
        'LED downlights (6W-12W, 600-1000 lumens)',
        'LED strip lights (for under-cabinet or cove lighting)',
        'Dimmer switches (trailing edge for LED)',
        'Motion sensors and smart switches',
        'Junction boxes and wire connectors',
        'Wire strippers and voltage tester'
      ],
      timeRequired: '1-2 days',
      tips: [
        'Use 80+ CRI (Color Rendering Index) LEDs for accurate color representation',
        'Layer lighting with ambient, task, and accent lighting',
        'Install dimmers to adjust lighting as per mood and time of day',
        'Choose IP65 rated fixtures for bathrooms and outdoor areas',
        'Group lights by function for better control'
      ]
    }

  };

  return {
    ...item,
    ...(guides[item.id] || {
      overview: 'We are preparing a detailed guide for this recommendation. It will include comprehensive step-by-step instructions, materials list, and expert tips to help you with your project.',
      steps: ['Detailed instructions coming soon. Our team is working on creating the perfect guide for you.'],
      materials: ['Materials list will be available soon'],
      timeRequired: 'Varies based on project scope',
      tips: ['Check back soon for expert tips and tricks']
    })
  };
};

export default function Recommendations() {
  const { recommendations, saved, setSaved, form } = useContext(AppContext);
  const [budgetFilter, setBudgetFilter] = useState('All Budgets');
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const openGuide = (item) => {
    setSelectedGuide(getGuideForRecommendation(item));
    setIsGuideOpen(true);
  };

  const closeGuide = () => {
    setIsGuideOpen(false);
    setTimeout(() => setSelectedGuide(null), 300); // Allow for animation
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true)
      const response = await apiService.recommendations.getRecommendations(form)
      setIsLoading(false)
    }
    fetchRecommendations()
  }, [form])

  const filtered = useMemo(() => {
    let list = [...recommendations]
    
    if (budgetFilter !== 'All Budgets') {
      const maxBudget = parseInt(budgetFilter)
      list = list.filter((r) => (r.costRange?.max || 0) <= maxBudget)
    }
    
    if (areaFilter !== 'All Areas') {
      list = list.filter((r) => {
        const title = r.title.toLowerCase()
        const desc = r.description.toLowerCase()
        const area = areaFilter.toLowerCase()
        return title.includes(area) || desc.includes(area)
      })
    }
    
    if (typeFilter !== 'All Types') {
      list = list.filter((r) => r.category === typeFilter)
    }
    
    return list
  }, [recommendations, budgetFilter, areaFilter, typeFilter])

  const toggleSave = (item) => {
    const exists = saved.find((s) => s.id === item.id)
    if (exists) setSaved(saved.filter((s) => s.id !== item.id))
    else setSaved([...saved, item])
  }

  const getImpactBadge = (category) => {
    const impacts = {
      'Interiors': { label: 'High Impact', color: 'bg-green-100 text-green-700 border-green-200' },
      'Smart Home': { label: 'Medium Impact', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      'Energy': { label: 'High Impact', color: 'bg-green-100 text-green-700 border-green-200' },
      'Civil': { label: 'High Impact', color: 'bg-green-100 text-green-700 border-green-200' },
      'Maintenance': { label: 'Medium Impact', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
    }
    return impacts[category] || { label: 'Medium Impact', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
  }

  const getIconForCategory = (category) => {
    const icons = {
      'Interiors': '🔍',
      'Smart Home': '📱',
      'Energy': '⚡',
      'Civil': '🏗️',
      'Maintenance': '🔧'
    }
    return icons[category] || '💡'
  }

  const getColorForCategory = (category) => {
    const colors = {
      'Interiors': 'bg-orange-100',
      'Smart Home': 'bg-blue-100',
      'Energy': 'bg-green-100',
      'Civil': 'bg-purple-100',
      'Maintenance': 'bg-yellow-100'
    }
    return colors[category] || 'bg-slate-100'
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <GuideModal 
        isOpen={isGuideOpen} 
        onClose={closeGuide} 
        guide={selectedGuide} 
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Personalized Recommendations</h1>
        <p className="text-slate-600">Based on your 2BHK Apartment in Whitefield, Bangalore</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="font-semibold text-slate-900 mb-4">Filter Recommendations</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">By Budget</label>
            <select 
              value={budgetFilter} 
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>All Budgets</option>
              <option value="50000">Up to ₹50,000</option>
              <option value="100000">Up to ₹1,00,000</option>
              <option value="200000">Up to ₹2,00,000</option>
              <option value="500000">Up to ₹5,00,000</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">By Area</label>
            <select 
              value={areaFilter} 
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>All Areas</option>
              <option>Kitchen</option>
              <option>Bedroom</option>
              <option>Bathroom</option>
              <option>Living Room</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type of Improvement</label>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>All Types</option>
              <option>Interiors</option>
              <option>Smart Home</option>
              <option>Energy</option>
              <option>Civil</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-slate-600 mt-2">Loading recommendations...</p>
            </div>
          </div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-600">No recommendations found</p>
          </div>
        )}
        {!isLoading && filtered.map((item) => {
          const impact = getImpactBadge(item.category)
          const icon = getIconForCategory(item.category)
          const bgColor = getColorForCategory(item.category)
          const isSaved = !!saved.find((s) => s.id === item.id)
          
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
              <div className="flex flex-col md:flex-row">
                <div className={`${bgColor} w-full md:w-64 h-48 md:h-auto flex items-center justify-center text-6xl`}>
                  {icon}
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-1">{item.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${impact.color}`}>
                        {impact.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4">{item.description}</p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Estimated Cost</div>
                      <div className="text-lg font-semibold text-slate-900">
                        ₹{item.costRange?.min?.toLocaleString()} - ₹{item.costRange?.max?.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Potential Value Addition</div>
                      <div className="text-lg font-semibold text-green-600">
                        +₹{Math.round((item.costRange?.max || 0) * 0.4).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => toggleSave(item)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                        isSaved 
                          ? 'bg-pink-50 text-pink-700 border-pink-200' 
                          : 'bg-white text-slate-700 border-slate-300 hover:border-pink-300'
                      }`}
                    >
                      <span>❤️</span>
                      <span className="text-sm font-medium">{isSaved ? 'Saved' : 'Save Idea'}</span>
                    </button>
                    <button 
                      onClick={() => openGuide(item)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                      View Detailed Guide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}