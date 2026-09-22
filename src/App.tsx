import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Waves,
  Mountain,
  CloudRain,
  Activity,
  Layers,
  MapPin,
  Cpu,
  BarChart3,
  Calendar,
  Play,
  Pause,
  RotateCcw,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Radio,
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  Sliders,
  Maximize2,
  Compass,
  ArrowUpRight,
  Droplets,
  Zap,
  Info,
  Download,
  Printer,
  ChevronDown,
  Navigation,
  HardDrive,
  Share2,
  Search,
  Bell,
  UserCheck,
  Sun,
  Moon
} from 'lucide-react';

// Village and hazard geospatial mock dataset (Hilly catchment C-14 focus zone)
const VILLAGES_DATA = [
  {
    id: 'V-101',
    name: 'ABC Village',
    catchment: 'C-14',
    coordinates: [31.1048, 77.1734],
    rainfall1h: 62,
    rainfall6h: 128,
    soilMoisture: 84,
    waterLevelStatus: 'RISING',
    waterLevelValue: 3.8,
    flowAccumulation: 'VERY HIGH',
    flashFloodProb: 88,
    flashFloodRisk: 'VERY HIGH',
    landslideSusceptibility: 72,
    landslideRisk: 'HIGH',
    population: 1420,
    elevation: '1,840 m',
    slopeAngle: '38°',
    geology: 'Weathered Phyllite & Schist',
    criticalAssets: ['Bridge B-02 (Downstream)', 'State Highway SH-12 (KM 41)'],
    topFactors: [
      'Intense upstream convective rainfall (62mm/1h)',
      'High soil saturation (84% threshold breach)',
      'Critical flow accumulation in stream feeder C-14',
      'Steep slope gradient (38°) on weathered substrate'
    ]
  },
  {
    id: 'V-102',
    name: 'Tehri Valley Hamlet',
    catchment: 'C-14',
    coordinates: [31.1210, 77.1950],
    rainfall1h: 48,
    rainfall6h: 96,
    soilMoisture: 78,
    waterLevelStatus: 'RISING',
    waterLevelValue: 2.9,
    flowAccumulation: 'HIGH',
    flashFloodProb: 74,
    flashFloodRisk: 'HIGH',
    landslideSusceptibility: 68,
    landslideRisk: 'HIGH',
    population: 860,
    elevation: '1,620 m',
    slopeAngle: '34°',
    geology: 'Colluvial Debris over Sandstone',
    criticalAssets: ['Pedestrian Footbridge P-04', 'L-07 Link Road'],
    topFactors: [
      'Persistent moderate-to-heavy rainfall',
      'High drainage density along lower reach',
      'Colluvial debris accumulation'
    ]
  },
  {
    id: 'V-103',
    name: 'Koteshwar Ridge Ward',
    catchment: 'C-12',
    coordinates: [31.0850, 77.1510],
    rainfall1h: 22,
    rainfall6h: 54,
    soilMoisture: 61,
    waterLevelStatus: 'STABLE',
    waterLevelValue: 1.4,
    flowAccumulation: 'MODERATE',
    flashFloodProb: 32,
    flashFloodRisk: 'LOW',
    landslideSusceptibility: 79,
    landslideRisk: 'HIGH',
    population: 2150,
    elevation: '2,110 m',
    slopeAngle: '44°',
    geology: 'Fractured Quartzite',
    criticalAssets: ['District Road DR-03'],
    topFactors: [
      'Steep sheared ridge face (44°)',
      'Historical toe-cutting activity',
      'Fractured rock structure'
    ]
  },
  {
    id: 'V-104',
    name: 'Malana Confluence',
    catchment: 'C-15',
    coordinates: [31.1420, 77.1320],
    rainfall1h: 14,
    rainfall6h: 38,
    soilMoisture: 49,
    waterLevelStatus: 'STABLE',
    waterLevelValue: 0.9,
    flowAccumulation: 'LOW',
    flashFloodProb: 21,
    flashFloodRisk: 'LOW',
    landslideSusceptibility: 35,
    landslideRisk: 'LOW',
    population: 640,
    elevation: '1,490 m',
    slopeAngle: '22°',
    geology: 'Gneiss Bedrock',
    criticalAssets: ['Power Sub-station feeder line'],
    topFactors: ['Well-drained terrace', 'Stable bedrock foundation']
  },
  {
    id: 'V-105',
    name: 'Gaurikund Sector 4',
    catchment: 'C-14',
    coordinates: [31.0920, 77.2180],
    rainfall1h: 58,
    rainfall6h: 114,
    soilMoisture: 82,
    waterLevelStatus: 'RAPID RISE',
    waterLevelValue: 3.4,
    flowAccumulation: 'HIGH',
    flashFloodProb: 82,
    flashFloodRisk: 'VERY HIGH',
    landslideSusceptibility: 65,
    landslideRisk: 'HIGH',
    population: 1180,
    elevation: '1,730 m',
    slopeAngle: '36°',
    geology: 'Glaciomarine silt & gravel',
    criticalAssets: ['Bridge B-03', 'Helipad Access Road'],
    topFactors: [
      'Direct catchment outflow channel',
      'High saturation in silty moraine matrix',
      'Culvert choke vulnerability'
    ]
  }
];

const IOT_SENSORS_DATA = [
  { id: 'RG-104', type: 'Rain Gauge', location: 'C-14 Upper Ridge', val: '62 mm/h', unit: 'mm/h', status: 'ONLINE', mode: 'SIMULATED IoT', lastUpdate: '8 sec ago', health: 98 },
  { id: 'SM-204', type: 'Soil Moisture', location: 'C-14 Western Slope', val: '84%', unit: '% Saturation', status: 'ONLINE', mode: 'SIMULATED IoT', lastUpdate: '14 sec ago', health: 96 },
  { id: 'WL-031', type: 'Water Level Radar', location: 'Bridge B-02 Confluence', val: '3.8 m', unit: 'meters', status: 'ONLINE', mode: 'SIMULATED IoT', lastUpdate: '5 sec ago', health: 100 },
  { id: 'RG-105', type: 'Rain Gauge', location: 'C-14 Mid Valley', val: '48 mm/h', unit: 'mm/h', status: 'ONLINE', mode: 'SIMULATED IoT', lastUpdate: '19 sec ago', health: 92 },
  { id: 'SM-205', type: 'Soil Moisture', location: 'Tehri Valley Sector 2', val: '78%', unit: '% Saturation', status: 'ONLINE', mode: 'SIMULATED IoT', lastUpdate: '11 sec ago', health: 94 },
  { id: 'PZ-012', type: 'Piezometer', location: 'Koteshwar Shear Zone', val: '4.2 kPa', unit: 'Pore Pressure', status: 'ONLINE', mode: 'SIMULATED IoT', lastUpdate: '25 sec ago', health: 89 },
  { id: 'IN-008', type: 'Inclinometer', location: 'Koteshwar Toe Cut', val: '1.8 mm/d', unit: 'Displacement', status: 'WARNING', mode: 'SIMULATED IoT', lastUpdate: '42 sec ago', health: 76 },
  { id: 'WL-032', type: 'Water Level Radar', location: 'Lower Gorge Intake', val: '1.4 m', unit: 'meters', status: 'ONLINE', mode: 'SIMULATED IoT', lastUpdate: '17 sec ago', health: 97 },
  { id: 'RG-108', type: 'Rain Gauge', location: 'Malana Ridge Crest', val: '14 mm/h', unit: 'mm/h', status: 'OFFLINE', mode: 'SIMULATED IoT', lastUpdate: '48 min ago', health: 0 }
];

const HISTORICAL_DISASTERS = [
  { id: 'HD-2023-08', year: '2023', month: 'August', location: 'C-14 Catchment, ABC Village Sector', hazard: 'Flash Flood + Debris Flow', rainfall24h: '242 mm', casualties: '0 (Early Evacuation)', damage: 'Bridge B-02 partial damage, Road washouts', returnPeriod: '1 in 25 yr' },
  { id: 'HD-2021-07', year: '2021', month: 'July', location: 'Koteshwar Ridge', hazard: 'Deep-Seated Landslide', rainfall24h: '188 mm', casualties: '0', damage: 'SH-12 blocked for 9 days', returnPeriod: '1 in 15 yr' },
  { id: 'HD-2018-09', year: '2018', month: 'September', location: 'Gaurikund Drainage', hazard: 'Flash Flood', rainfall24h: '210 mm', casualties: '2 injured', damage: '14 structures damaged', returnPeriod: '1 in 20 yr' },
  { id: 'HD-2015-08', year: '2015', month: 'August', location: 'Upper Catchment C-14 & C-15', hazard: 'Cloudburst & Slope Failure', rainfall24h: '290 mm', casualties: '4 casualties', damage: 'Heavy agricultural siltation', returnPeriod: '1 in 50 yr' }
];

function getRiskBadgeClasses(level) {
  switch (level?.toUpperCase()) {
    case 'VERY HIGH':
    case 'CRITICAL':
      return 'bg-red-950/80 text-red-300 border border-red-700/80 font-semibold';
    case 'HIGH':
      return 'bg-orange-950/80 text-orange-300 border border-orange-700/80 font-semibold';
    case 'MODERATE':
    case 'MEDIUM':
      return 'bg-amber-950/80 text-amber-300 border border-amber-700/80 font-semibold';
    case 'LOW':
    case 'NORMAL':
    default:
      return 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/80 font-semibold';
  }
}

function getRiskDot(level) {
  switch (level?.toUpperCase()) {
    case 'VERY HIGH':
    case 'CRITICAL':
      return 'bg-red-500 animate-pulse';
    case 'HIGH':
      return 'bg-orange-500';
    case 'MODERATE':
      return 'bg-amber-400';
    default:
      return 'bg-emerald-400';
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('command-center');
  const [selectedVillage, setSelectedVillage] = useState(VILLAGES_DATA[0]);
  const [activeAlertsAwaiting, setActiveAlertsAwaiting] = useState(3);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState({});
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toUTCString());
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('sih26192-theme') || 'dark'; } catch { return 'dark'; }
  });

  useEffect(() => {
    try { localStorage.setItem('sih26192-theme', theme); } catch {}
  }, [theme]);

  // Simulation State Management for SIH Demo
  const [simulationStage, setSimulationStage] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);

  // Layer Controls for GIS map
  const [mapLayers, setMapLayers] = useState({
    floodRisk: true,
    landslideRisk: true,
    rainfall: true,
    soilMoisture: true,
    waterLevel: true,
    sensors: true,
    villages: true,
    roadsBridges: true,
    catchmentBounds: true
  });

  // Ticking time for official operations clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulation timer loop
  useEffect(() => {
    let simInterval;
    if (isSimulating) {
      simInterval = setInterval(() => {
        setSimulationStage(prev => (prev >= 5 ? 1 : prev + 1));
      }, 4200);
    }
    return () => clearInterval(simInterval);
  }, [isSimulating]);

  // Derived simulation multipliers to realistically alter metrics across the platform
  const simFactors = useMemo(() => {
    switch (simulationStage) {
      case 1: // Normal
        return { rainMult: 0.25, soilDelta: -25, waterMult: 0.35, floodProb: 15, slopeScore: 32, label: 'STAGE 1: BASELINE NORMAL', risk: 'LOW' };
      case 2: // Heavy Rain
        return { rainMult: 0.65, soilDelta: -10, waterMult: 0.6, floodProb: 44, slopeScore: 48, label: 'STAGE 2: INTENSE RAINFALL COMMENCING', risk: 'MODERATE' };
      case 3: // Saturation
        return { rainMult: 0.95, soilDelta: +5, waterMult: 0.85, floodProb: 68, slopeScore: 64, label: 'STAGE 3: HYDROLOGICAL SATURATION REACHED', risk: 'HIGH' };
      case 4: // Rapid Response
        return { rainMult: 1.25, soilDelta: +12, waterMult: 1.15, floodProb: 84, slopeScore: 71, label: 'STAGE 4: RAPID RUNOFF & GAUGE SPIKE', risk: 'VERY HIGH' };
      case 5: // Full Multi-Hazard Warning
        return { rainMult: 1.45, soilDelta: +16, waterMult: 1.35, floodProb: 92, slopeScore: 78, label: 'STAGE 5: CRITICAL MULTI-HAZARD WARNING ACTIVE', risk: 'CRITICAL' };
      default:
        return { rainMult: 1, soilDelta: 0, waterMult: 1, floodProb: 88, slopeScore: 72, label: 'OPERATIONAL LIVE', risk: 'VERY HIGH' };
    }
  }, [simulationStage]);

  const handleAcknowledgeAlert = (id) => {
    setAcknowledgedAlerts(prev => ({ ...prev, [id]: true }));
    setActiveAlertsAwaiting(prev => Math.max(0, prev - 1));
  };

  const NavItem = ({ id, label, icon: Icon, badge }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium rounded border transition-colors ${
          isActive
            ? 'bg-blue-900/60 text-white border-blue-500/80 shadow-sm'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border-transparent'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
          <span className="tracking-wide text-left">{label}</span>
        </div>
        {badge && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-600/90 text-white animate-pulse">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-[#070c17] text-slate-100 flex flex-col font-sans select-none antialiased">
      {}
      <header className="sticky top-0 z-50 bg-[#0b1324] border-b border-slate-800/90 shadow-md">
        <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Official Emblem Title and SIH Label */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded border border-blue-500/40 bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center p-1.5 shadow-inner">
              <ShieldAlert className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm md:text-base tracking-wider text-white">
                  NATIONAL MULTI-HAZARD EARLY WARNING SYSTEM
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-blue-950 text-blue-300 border border-blue-800 rounded">
                  MoES / NDMA ARCHITECTURE
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono tracking-tight flex items-center gap-2">
                <span className="text-amber-400 font-semibold">SIH26192</span>
                <span>•</span>
                <span>SMART INDIA HACKATHON 2026</span>
                <span>•</span>
                <span className="text-slate-400">HILLY REGIONS DISASTER RESILIENCE</span>
              </div>
            </div>
          </div>

          {/* Operational Status Tickers */}
          <div className="hidden xl:flex items-center space-x-4 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded text-xs">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-400">CORE STATUS:</span>
              <span className="font-bold text-emerald-400 tracking-wider">OPERATIONAL</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono text-[11px] text-slate-200">{currentTime}</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <div className="flex items-center space-x-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-slate-300">Telemetry: <strong className="text-white">84 / 91 Active</strong></span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <span className="bg-red-950/80 text-red-300 text-[10px] px-2 py-0.5 rounded border border-red-700 font-bold uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-400" /> C-14 LEVEL 3 WARNING
            </span>
          </div>

          {/* Authority User & Alert Drawer Trigger */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>
            <button
              onClick={() => setIsAlertDrawerOpen(!isAlertDrawerOpen)}
              className="relative p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Active Critical Alerts"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {activeAlertsAwaiting > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {activeAlertsAwaiting}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-[11px] font-bold text-slate-200">DDMA OFFICER #26</div>
                <div className="text-[9px] text-slate-400">EMERGENCY CONTROL ROOM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Warning Flash Ticker */}
        <div className="bg-amber-950/40 border-t border-b border-amber-900/60 px-4 py-1 text-[11px] flex items-center justify-between overflow-hidden">
          <div className="flex items-center space-x-2 truncate">
            <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-bold uppercase rounded">URGENT</span>
            <span className="text-amber-200 font-medium">
              C-14 Catchment: Flash-flood probability at 88% (Very High). Landslide susceptibility at 72/100 (High) for ABC Village & Bridge B-02 sector.
            </span>
          </div>
          <div className="hidden lg:flex items-center space-x-2 text-[10px] text-slate-400 font-mono flex-shrink-0">
            <span>DATA MODE:</span>
            <span className="bg-slate-800 px-1.5 py-0.2 text-emerald-300 rounded border border-slate-700">
              NEAR-REAL-TIME + SIMULATED IoT
            </span>
          </div>
        </div>
      </header>

      {}
      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Authority Sidebar */}
        <aside className="w-64 bg-[#09101f] border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0 z-20">
          <div className="p-3 space-y-4 overflow-y-auto">
            <div className="px-2 pt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              DISASTER INTELLIGENCE MODULES
            </div>
            <nav className="space-y-1">
              <NavItem id="command-center" label="Command Center" icon={Activity} />
              <NavItem id="live-map" label="Live Multi-Hazard Map" icon={MapPin} />
              <NavItem id="rainfall" label="Rainfall Intelligence" icon={CloudRain} />
              <NavItem id="catchment" label="Catchment Intelligence" icon={Waves} />
              <NavItem id="slope" label="Slope Stability" icon={Mountain} />
              <NavItem id="ai-prediction" label="AI Prediction & Explain" icon={Cpu} />
              <NavItem id="sensors" label="IoT Sensor Network" icon={Radio} badge="91 Total" />
              <NavItem id="warnings" label="Early Warnings & Alert Center" icon={ShieldAlert} badge={activeAlertsAwaiting > 0 ? `${activeAlertsAwaiting}` : null} />
              <NavItem id="historical" label="Historical Events" icon={Calendar} />
              <NavItem id="simulation" label="SIH Event Simulator" icon={Play} />
              <NavItem id="reports" label="Reports & Decision Support" icon={FileText} />
            </nav>

            <div className="pt-2 border-t border-slate-800/70">
              <div className="px-2 pb-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                ACTIVE CATCHMENT FOCUS
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Target:</span>
                  <span className="font-bold text-blue-300 font-mono">Catchment C-14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Monitored Villages:</span>
                  <span className="font-bold text-white">5 High-Risk Units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Stream Gauge B2:</span>
                  <span className="font-bold text-red-400">3.8m (Warning: 3.5m)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar System Diagnostic Footer */}
          <div className="p-3 border-t border-slate-800 bg-[#070d18] text-[11px] text-slate-400 space-y-1.5">
            <div className="flex justify-between items-center text-[10px]">
              <span>HYDROLOGY ENGINE:</span>
              <span className="text-emerald-400 font-mono font-bold">ONLINE (v2.4)</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span>SLOPE STABILITY:</span>
              <span className="text-emerald-400 font-mono font-bold">ONLINE (v1.9)</span>
            </div>
            <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-800/60 text-center">
              SIH26192 • GOVT EOC ARCHITECTURE
            </div>
          </div>
        </aside>

        {/* Dynamic Page Router Container */}
        <main className="flex-1 overflow-y-auto bg-[#060b14] p-4 md:p-6">
          {activeTab === 'command-center' && (
            <CommandCenterPage
              selectedVillage={selectedVillage}
              setSelectedVillage={setSelectedVillage}
              simFactors={simFactors}
              simulationStage={simulationStage}
              setActiveTab={setActiveTab}
              mapLayers={mapLayers}
              setMapLayers={setMapLayers}
            />
          )}

          {activeTab === 'live-map' && (
            <LiveMapPage
              selectedVillage={selectedVillage}
              setSelectedVillage={setSelectedVillage}
              mapLayers={mapLayers}
              setMapLayers={setMapLayers}
              simFactors={simFactors}
            />
          )}

          {activeTab === 'rainfall' && (
            <RainfallIntelligencePage selectedVillage={selectedVillage} simFactors={simFactors} />
          )}

          {activeTab === 'catchment' && (
            <CatchmentIntelligencePage selectedVillage={selectedVillage} simFactors={simFactors} />
          )}

          {activeTab === 'slope' && (
            <SlopeStabilityPage selectedVillage={selectedVillage} simFactors={simFactors} />
          )}

          {activeTab === 'ai-prediction' && (
            <AIPredictionPage selectedVillage={selectedVillage} simFactors={simFactors} />
          )}

          {activeTab === 'sensors' && (
            <SensorNetworkPage simFactors={simFactors} />
          )}

          {activeTab === 'warnings' && (
            <EarlyWarningsPage
              selectedVillage={selectedVillage}
              simFactors={simFactors}
              acknowledgedAlerts={acknowledgedAlerts}
              onAcknowledge={handleAcknowledgeAlert}
            />
          )}

          {activeTab === 'historical' && (
            <HistoricalEventsPage />
          )}

          {activeTab === 'simulation' && (
            <SimulationPage
              simulationStage={simulationStage}
              setSimulationStage={setSimulationStage}
              isSimulating={isSimulating}
              setIsSimulating={setIsSimulating}
              simFactors={simFactors}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage selectedVillage={selectedVillage} />
          )}
        </main>
      </div>

      {}
      {isAlertDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-[#0c1427] border-l border-slate-700 shadow-2xl z-50 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-sm tracking-wide text-white">EOC ACTIVE ALERTS</h3>
              </div>
              <button
                onClick={() => setIsAlertDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="bg-red-950/60 border border-red-800/80 p-3 rounded text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-red-300">MULTI-HAZARD PRIORITY 1</span>
                  <span className="text-[10px] bg-red-900 px-1.5 py-0.5 rounded text-white font-mono">12m ago</span>
                </div>
                <div className="text-white font-medium">ABC Village / Catchment C-14</div>
                <div className="text-slate-300 text-[11px]">
                  Simultaneous Flash Flood (88%) & Landslide Susceptibility (72/100). Bridge B-02 clearance less than 0.7m.
                </div>
                <button
                  onClick={() => {
                    setActiveTab('warnings');
                    setIsAlertDrawerOpen(false);
                  }}
                  className="w-full mt-2 py-1.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded text-[11px] uppercase tracking-wider"
                >
                  Review Warning Protocol
                </button>
              </div>

              <div className="bg-orange-950/60 border border-orange-800/80 p-3 rounded text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-orange-300">SLOPE INSTABILITY ALERT</span>
                  <span className="text-[10px] bg-orange-900 px-1.5 py-0.5 rounded text-white font-mono">28m ago</span>
                </div>
                <div className="text-white font-medium">Koteshwar Ridge Ward</div>
                <div className="text-slate-300 text-[11px]">
                  Inclinometer IN-008 recorded 1.8mm/day displacement following toe excavation on District Road DR-03.
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 text-[10px] text-slate-400 text-center">
            Standard Operating Procedure SOP-NDMA-2026 Active
          </div>
        </div>
      )}

      <style>{`
        /* SIH26192 Light Mode — keeps the existing dark command-center design intact */
        [data-theme="light"] {
          color-scheme: light;
          background: #f4f7fb !important;
          color: #172033 !important;
        }
        [data-theme="light"] [class*="bg-[#07"],
        [data-theme="light"] [class*="bg-[#06"],
        [data-theme="light"] [class*="bg-[#09"],
        [data-theme="light"] [class*="bg-[#0b"],
        [data-theme="light"] [class*="bg-[#0c"],
        [data-theme="light"] [class*="bg-slate-950"],
        [data-theme="light"] [class*="bg-slate-900"],
        [data-theme="light"] [class*="bg-slate-800"] {
          background-color: #ffffff !important;
          background-image: none !important;
        }
        [data-theme="light"] [class*="bg-slate-700"] { background-color: #e2e8f0 !important; }
        [data-theme="light"] [class*="bg-slate-800"]:hover,
        [data-theme="light"] [class*="hover:bg-slate-800"]:hover,
        [data-theme="light"] [class*="hover:bg-slate-700"]:hover { background-color: #e2e8f0 !important; }
        [data-theme="light"] [class*="text-white"] { color: #172033 !important; }
        [data-theme="light"] [class*="text-slate-100"],
        [data-theme="light"] [class*="text-slate-200"],
        [data-theme="light"] [class*="text-slate-300"] { color: #334155 !important; }
        [data-theme="light"] [class*="text-slate-400"] { color: #64748b !important; }
        [data-theme="light"] [class*="text-slate-500"] { color: #64748b !important; }
        [data-theme="light"] [class*="text-slate-600"],
        [data-theme="light"] [class*="text-slate-700"] { color: #475569 !important; }
        [data-theme="light"] [class*="border-slate-800"],
        [data-theme="light"] [class*="border-slate-700"],
        [data-theme="light"] [class*="border-slate-600"] { border-color: #d7dee8 !important; }
        [data-theme="light"] [class*="border-slate-800"] { border-color: #e2e8f0 !important; }
        [data-theme="light"] [class*="bg-blue-950"],
        [data-theme="light"] [class*="bg-blue-900"] { background-color: #eff6ff !important; }
        [data-theme="light"] [class*="bg-amber-950"] { background-color: #fffbeb !important; }
        [data-theme="light"] [class*="bg-orange-950"] { background-color: #fff7ed !important; }
        [data-theme="light"] [class*="bg-red-950"] { background-color: #fef2f2 !important; }
        [data-theme="light"] [class*="border-blue-900"] { border-color: #bfdbfe !important; }
        [data-theme="light"] [class*="border-blue-800"] { border-color: #bfdbfe !important; }
        [data-theme="light"] [class*="border-amber-900"],
        [data-theme="light"] [class*="border-amber-800"] { border-color: #fcd34d !important; }
        [data-theme="light"] [class*="border-orange-900"],
        [data-theme="light"] [class*="border-orange-800"] { border-color: #fdba74 !important; }
        [data-theme="light"] [class*="border-red-900"],
        [data-theme="light"] [class*="border-red-800"] { border-color: #fecaca !important; }
        [data-theme="light"] [class*="text-blue-300"] { color: #1d4ed8 !important; }
        [data-theme="light"] [class*="text-blue-400"] { color: #2563eb !important; }
        [data-theme="light"] [class*="text-amber-200"] { color: #92400e !important; }
        [data-theme="light"] [class*="text-amber-300"] { color: #92400e !important; }
        [data-theme="light"] [class*="text-amber-400"] { color: #b45309 !important; }
        [data-theme="light"] [class*="text-orange-200"] { color: #9a3412 !important; }
        [data-theme="light"] [class*="text-orange-300"],
        [data-theme="light"] [class*="text-orange-400"] { color: #c2410c !important; }
        [data-theme="light"] [class*="text-red-300"] { color: #b91c1c !important; }
        [data-theme="light"] [class*="text-red-400"] { color: #dc2626 !important; }
        [data-theme="light"] [class*="text-emerald-300"],
        [data-theme="light"] [class*="text-emerald-400"] { color: #047857 !important; }
        [data-theme="light"] [class*="text-purple-200"],
        [data-theme="light"] [class*="text-purple-300"] { color: #7e22ce !important; }
        [data-theme="light"] [class*="bg-gradient-to-br"] { background-image: linear-gradient(to bottom right, #ffffff, #eff6ff) !important; }
        [data-theme="light"] button[class*="bg-red-"],
        [data-theme="light"] button[class*="bg-blue-700"],
        [data-theme="light"] button[class*="bg-blue-600"],
        [data-theme="light"] button[class*="bg-emerald-500"],
        [data-theme="light"] button[class*="bg-orange-500"] { color: #ffffff !important; }
        [data-theme="light"] button[class*="bg-red-"] [class*="text-white"],
        [data-theme="light"] button[class*="bg-blue-700"] [class*="text-white"],
        [data-theme="light"] button[class*="bg-blue-600"] [class*="text-white"] { color: #ffffff !important; }
        [data-theme="light"] input,
        [data-theme="light"] select,
        [data-theme="light"] textarea { color: #172033 !important; background-color: #ffffff !important; }
        [data-theme="light"] .shadow-2xl { box-shadow: 0 20px 50px rgba(15,23,42,.16) !important; }
      `}</style>
    </div>
  );
}

function CommandCenterPage({
  selectedVillage,
  setSelectedVillage,
  simFactors,
  simulationStage,
  setActiveTab,
  mapLayers,
  setMapLayers
}) {
  const currentRainfall = Math.round(selectedVillage.rainfall1h * simFactors.rainMult);
  const currentSoilMoisture = Math.min(98, Math.max(30, selectedVillage.soilMoisture + simFactors.soilDelta));
  const currentFloodProb = Math.min(99, Math.max(10, Math.round(selectedVillage.flashFloodProb * (simFactors.floodProb / 88))));
  const currentSlopeScore = Math.min(98, Math.max(20, Math.round(selectedVillage.landslideSusceptibility * (simFactors.slopeScore / 72))));

  return (
    <div className="space-y-5">
      {/* Title & Operational Context */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">COMMAND CENTER</h1>
            <span className="bg-blue-900/50 border border-blue-600/80 text-blue-300 text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
              DISTRICT EOC PERSPECTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hyper-local multi-hazard monitoring, catchment response intelligence & village-level early warning
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Simulation Mode</div>
            <div className="text-xs font-bold text-amber-300 font-mono">{simFactors.label}</div>
          </div>
          <button
            onClick={() => setActiveTab('simulation')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>Tune Simulation</span>
          </button>
        </div>
      </div>

      {/* Six KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          title="VILLAGES MONITORED"
          val="128"
          status="5 Under High Alert"
          icon={MapPin}
          trend="+2 vs Yesterday"
          badgeColor="text-blue-400"
        />
        <KPICard
          title="CRITICAL CATCHMENTS"
          val="14"
          status="C-14 Triggered Level 3"
          icon={Waves}
          trend="Peak Inflow Imminent"
          badgeColor="text-amber-400"
        />
        <KPICard
          title="FLASH-FLOOD WARNINGS"
          val={simulationStage >= 4 ? "03" : "01"}
          status="Lead Time: 1–3 Hours"
          icon={AlertTriangle}
          trend="88% Max Probability"
          badgeColor="text-red-400"
          alertPulse={simulationStage >= 4}
        />
        <KPICard
          title="HIGH-SUSCEPTIBILITY SLOPES"
          val="27"
          status="72/100 Max Score"
          icon={Mountain}
          trend="Saturated Soil Precursor"
          badgeColor="text-orange-400"
        />
        <KPICard
          title="SENSORS ONLINE"
          val="84 / 91"
          status="92.3% Network Uptime"
          icon={Radio}
          trend="7 Offline / Degraded"
          badgeColor="text-emerald-400"
        />
        <KPICard
          title="HIGHEST CURRENT HAZARD"
          val={simFactors.risk}
          status="C-14 ABC Village Sector"
          icon={ShieldAlert}
          trend="Multi-Hazard Concurrence"
          badgeColor={simulationStage >= 3 ? "text-red-400" : "text-amber-400"}
          alertPulse={simulationStage >= 4}
        />
      </div>

      {/* Dominant GIS Map & Village Inspector Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Command Center GIS Map (Visually Dominant - 8 cols) */}
        <div className="lg:col-span-8 bg-[#0b1324] border border-slate-800 rounded-lg p-3 shadow-lg flex flex-col">
          <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-slate-800/80 gap-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold tracking-wide text-white uppercase">
                LIVE MULTI-HAZARD RISK MAP (GIS COMMAND VIEW)
              </h2>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                EPSG:4326 • HYPSOMETRIC RELIEF
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center space-x-2">
              <span>Selected Village:</span>
              <strong className="text-blue-300">{selectedVillage.name}</strong>
            </div>
          </div>

          {/* Map Controls Layer Bar */}
          <div className="bg-slate-900/90 border border-slate-800/90 p-2 rounded mb-2.5 flex flex-wrap gap-2 text-[11px]">
            <LayerToggle
              label="Flash Flood Risk"
              active={mapLayers.floodRisk}
              color="text-red-400"
              onClick={() => setMapLayers(p => ({ ...p, floodRisk: !p.floodRisk }))}
            />
            <LayerToggle
              label="Landslide Susceptibility"
              active={mapLayers.landslideRisk}
              color="text-orange-400"
              onClick={() => setMapLayers(p => ({ ...p, landslideRisk: !p.landslideRisk }))}
            />
            <LayerToggle
              label="Rainfall Isohyets"
              active={mapLayers.rainfall}
              color="text-blue-400"
              onClick={() => setMapLayers(p => ({ ...p, rainfall: !p.rainfall }))}
            />
            <LayerToggle
              label="Soil Saturation"
              active={mapLayers.soilMoisture}
              color="text-amber-400"
              onClick={() => setMapLayers(p => ({ ...p, soilMoisture: !p.soilMoisture }))}
            />
            <LayerToggle
              label="Streams & Water Radar"
              active={mapLayers.waterLevel}
              color="text-cyan-400"
              onClick={() => setMapLayers(p => ({ ...p, waterLevel: !p.waterLevel }))}
            />
            <LayerToggle
              label="IoT Sensors"
              active={mapLayers.sensors}
              color="text-emerald-400"
              onClick={() => setMapLayers(p => ({ ...p, sensors: !p.sensors }))}
            />
            <LayerToggle
              label="Bridges & SH-12 Road"
              active={mapLayers.roadsBridges}
              color="text-purple-400"
              onClick={() => setMapLayers(p => ({ ...p, roadsBridges: !p.roadsBridges }))}
            />
          </div>

          {/* Interactive Tactical GIS Map Surface */}
          <div className="relative flex-1 min-h-[460px] bg-[#070e1c] rounded border border-slate-800/90 overflow-hidden flex flex-col justify-between p-3">
            {/* Background Topographic Contour Lines SVG Mockup */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Elevation Contours */}
                <path d="M 10 180 Q 220 80 440 210 T 820 160" fill="none" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                <path d="M 20 280 Q 260 190 520 320 T 900 240" fill="none" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.5" />
                <path d="M 10 390 Q 300 290 600 420 T 940 310" fill="none" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
                {/* Catchment C-14 Perimeter */}
                {mapLayers.catchmentBounds && (
                  <path d="M 140 70 L 480 60 L 640 180 L 590 390 L 320 440 L 120 310 Z" fill="#1e3a8a" fillOpacity="0.12" stroke="#3b82f6" strokeWidth="1.8" strokeDasharray="6 4" />
                )}
                {/* Drainage Stream Line */}
                {mapLayers.waterLevel && (
                  <path d="M 230 80 Q 340 190 380 270 T 560 380" fill="none" stroke="#06b6d4" strokeWidth="3.5" opacity="0.8" />
                )}
                {/* Road SH-12 */}
                {mapLayers.roadsBridges && (
                  <path d="M 90 260 Q 310 240 460 290 T 780 340" fill="none" stroke="#a855f7" strokeWidth="2.2" strokeDasharray="5 3" opacity="0.75" />
                )}
              </svg>
            </div>

            {/* Top Tactical Overlay HUD */}
            <div className="relative z-10 flex justify-between items-start pointer-events-none">
              <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded text-[11px] font-mono space-y-0.5">
                <div className="text-slate-400">ACTIVE REGION: HIMACHAL / UTTARAKHAND HILLY TERRAIN</div>
                <div className="text-blue-300">CATCHMENT C-14 • WATERSHED AREA: 48.6 km²</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded text-[10px] space-y-1 font-mono">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="text-slate-300">Very High Risk Zone</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  <span className="text-slate-300">High Risk Zone</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-300">Baseline Normal</span>
                </div>
              </div>
            </div>

            {/* Interactive Village & Asset Nodes Placed on GIS Plane */}
            <div className="relative z-10 my-auto grid grid-cols-2 md:grid-cols-3 gap-6 py-6 px-4">
              {VILLAGES_DATA.map((village) => {
                const isSelected = selectedVillage.id === village.id;
                const isVeryHigh = village.flashFloodRisk === 'VERY HIGH' || simulationStage >= 4;
                return (
                  <div
                    key={village.id}
                    onClick={() => setSelectedVillage(village)}
                    className={`cursor-pointer p-3 rounded-lg border transition-all transform hover:-translate-y-0.5 shadow-md ${
                      isSelected
                        ? 'bg-slate-900/95 border-blue-400 ring-2 ring-blue-500/40'
                        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-700/80'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${getRiskDot(village.flashFloodRisk)}`} />
                        <span className="text-xs font-bold text-white tracking-wide">{village.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{village.catchment}</span>
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[10px] font-mono bg-slate-950/70 p-1.5 rounded border border-slate-800">
                      <div>
                        <span className="text-slate-400 block">Flood Prob:</span>
                        <span className={`font-bold ${isVeryHigh ? 'text-red-400' : 'text-slate-200'}`}>
                          {village.id === 'V-101' ? currentFloodProb : village.flashFloodProb}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Landslide:</span>
                        <span className="font-bold text-orange-400">
                          {village.id === 'V-101' ? currentSlopeScore : village.landslideSusceptibility}/100
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-[9px] text-slate-400 flex items-center justify-between">
                      <span>Stream: {village.waterLevelStatus}</span>
                      <span className="text-blue-400 font-semibold underline">Inspect &rarr;</span>
                    </div>
                  </div>
                );
              })}

              {/* Critical Infrastructure Node: Bridge B-02 */}
              {mapLayers.roadsBridges && (
                <div className="p-2.5 rounded border border-purple-800 bg-purple-950/40 text-[10px] space-y-1">
                  <div className="flex justify-between items-center text-purple-200 font-bold">
                    <span>BRIDGE B-02 CONFLUENCE</span>
                    <span className="bg-red-950 text-red-300 px-1 rounded border border-red-700 text-[9px]">CRITICAL</span>
                  </div>
                  <div className="text-slate-300 text-[10px]">
                    Water level at 3.8m. Clearance margin critical (0.7m to girder).
                  </div>
                  <div className="text-purple-300 font-mono text-[9px]">Road: State Highway SH-12</div>
                </div>
              )}
            </div>

            {/* Bottom GIS Navigation & Scale Marker */}
            <div className="relative z-10 flex flex-wrap justify-between items-center bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded text-[10px] text-slate-400 font-mono">
              <div className="flex items-center space-x-3">
                <span>SCALE: 1:25,000</span>
                <span>•</span>
                <span>CONTOUR INT: 20m</span>
                <span>•</span>
                <span>DATUM: WGS 84</span>
              </div>
              <div className="text-amber-400 flex items-center space-x-1">
                <Info className="w-3 h-3" />
                <span>GIS TERRAIN TILES CACHED • LOCAL RECTIFICATION VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAP SIDE PANEL (Village Intelligence Detail - 4 cols) */}
        <div className="lg:col-span-4 bg-[#0b1324] border border-slate-800 rounded-lg p-3.5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-blue-400 font-semibold">
                  VILLAGE / WARD RISK DOSSIER
                </span>
                <h3 className="text-lg font-bold text-white tracking-wide">{selectedVillage.name}</h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded ${getRiskBadgeClasses(selectedVillage.flashFloodRisk)}`}>
                {selectedVillage.flashFloodRisk}
              </span>
            </div>

            {/* Physical Attributes Bar */}
            <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2 rounded border border-slate-800 text-[11px] font-mono mb-3">
              <div>
                <span className="text-slate-500 text-[10px] block">CATCHMENT</span>
                <span className="font-bold text-white">{selectedVillage.catchment}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">ELEVATION</span>
                <span className="font-bold text-white">{selectedVillage.elevation}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">SLOPE</span>
                <span className="font-bold text-white">{selectedVillage.slopeAngle}</span>
              </div>
            </div>

            {/* SEPARATE HAZARD STREAMS (Crucial SIH26192 Requirement) */}
            <div className="space-y-3">
              {/* STREAM 1: FLASH-FLOOD INTELLIGENCE */}
              <div className="p-3 rounded border border-blue-900/80 bg-blue-950/30 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-300">
                    <Waves className="w-4 h-4 text-cyan-400" />
                    <span>FLASH-FLOOD INTELLIGENCE</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getRiskBadgeClasses(selectedVillage.flashFloodRisk)}`}>
                    RISK: {selectedVillage.flashFloodRisk}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Probability</div>
                    <div className="text-base font-extrabold text-red-400 font-mono">
                      {selectedVillage.id === 'V-101' ? currentFloodProb : selectedVillage.flashFloodProb}%
                    </div>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Stream Radar B2</div>
                    <div className="text-base font-extrabold text-amber-400 font-mono">
                      {selectedVillage.waterLevelValue}m ({selectedVillage.waterLevelStatus})
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 flex justify-between">
                  <span>Rainfall (1h / 6h):</span>
                  <span className="font-mono text-white font-semibold">
                    {selectedVillage.id === 'V-101' ? currentRainfall : selectedVillage.rainfall1h} mm / {selectedVillage.rainfall6h} mm
                  </span>
                </div>
              </div>

              {/* STREAM 2: LANDSLIDE & SLOPE STABILITY INTELLIGENCE */}
              <div className="p-3 rounded border border-orange-900/80 bg-orange-950/20 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-orange-300">
                    <Mountain className="w-4 h-4 text-orange-400" />
                    <span>SLOPE STABILITY INTELLIGENCE</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getRiskBadgeClasses(selectedVillage.landslideRisk)}`}>
                    RISK: {selectedVillage.landslideRisk}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Susceptibility Score</div>
                    <div className="text-base font-extrabold text-orange-400 font-mono">
                      {selectedVillage.id === 'V-101' ? currentSlopeScore : selectedVillage.landslideSusceptibility} / 100
                    </div>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Soil Saturation</div>
                    <div className="text-base font-extrabold text-amber-400 font-mono">
                      {selectedVillage.id === 'V-101' ? currentSoilMoisture : selectedVillage.soilMoisture}%
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400">
                  Substrate: <strong className="text-slate-200">{selectedVillage.geology}</strong>
                </div>
              </div>

              {/* Top Model Factors List */}
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded text-xs space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  PRIMARY RISK FACTORS IDENTIFIED:
                </div>
                <ul className="space-y-1">
                  {selectedVillage.topFactors.map((factor, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 flex items-start space-x-1.5">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Trigger & Data Mode Attribution */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>DATA TELEMETRY:</span>
              <span className="text-amber-400 font-semibold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                NEAR-REAL-TIME + SIMULATED IoT
              </span>
            </div>
            <button
              onClick={() => setActiveTab('warnings')}
              className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded text-xs tracking-wider uppercase transition shadow"
            >
              Issue Local Action Directive
            </button>
          </div>
        </div>
      </div>

      {/* Lower Command Center Section: Rainfall Trend, Active Alerts Timeline, Data Engine Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rainfall Trend Graph Mockup */}
        <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-3.5 space-y-2.5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-1.5">
              <CloudRain className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                HYETOGRAPH TREND (C-14 RIDGE)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">1h | 3h | 6h | 12h | 24h</span>
          </div>

          {/* Graphical Hyetograph Visual */}
          <div className="h-40 flex items-end justify-between gap-2 pt-6 px-2 bg-slate-900/60 rounded border border-slate-800">
            <BarGraphCol height="35%" label="24h" val="18mm" />
            <BarGraphCol height="45%" label="12h" val="32mm" />
            <BarGraphCol height="70%" label="6h" val="74mm" />
            <BarGraphCol height="88%" label="3h" val="102mm" highlight />
            <BarGraphCol height="96%" label="1h" val={`${currentRainfall}mm`} alert />
            <BarGraphCol height="60%" label="Fcst +2h" val="45mm" forecast />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
            <span>Antecedent 3-day sum: 184mm</span>
            <span className="text-red-400 font-bold">Exceeds Runoff Threshold (120mm)</span>
          </div>
        </div>

        {/* Active Alerts Timeline */}
        <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-3.5 space-y-2.5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                ACTIVE EOC ALERT DISPATCH
              </h3>
            </div>
            <span className="text-[10px] bg-red-950 text-red-300 px-1.5 py-0.5 rounded border border-red-800 font-bold">
              3 ACTIVE
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            <AlertItemMini
              title="Flash Flood Flash Alert"
              loc="ABC Village & Bridge B2"
              time="14 min ago"
              sev="VERY HIGH"
              action="Pre-position local SDRF boat teams"
            />
            <AlertItemMini
              title="Slope Shear Warning"
              loc="Koteshwar Ridge Ward"
              time="32 min ago"
              sev="HIGH"
              action="Restrict heavy traffic on SH-12"
            />
            <AlertItemMini
              title="Rapid Stream Rise"
              loc="Gaurikund Sector 4"
              time="51 min ago"
              sev="HIGH"
              action="Clear riverbank settlements"
            />
          </div>
        </div>

        {/* Data Source & System Health Status */}
        <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-3.5 space-y-2.5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-1.5">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                SYSTEM HEALTH & INGEST PIPELINE
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">100% NOMINAL</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <HealthItem title="Rainfall Feed (AWS / IMD Grid)" status="CONNECTED" latency="1.2s" ok />
            <HealthItem title="IoT Sensor Telemetry Mesh" status="84/91 ONLINE" latency="0.8s" ok />
            <HealthItem title="GIS DEM & Hypsometric Server" status="AVAILABLE" latency="22ms" ok />
            <HealthItem title="Hydrology Runoff Engine (HEC-HMS)" status="OPERATIONAL" latency="3.1s" ok />
            <HealthItem title="Geotech Slope Stability Solver" status="OPERATIONAL" latency="2.8s" ok />
            <HealthItem title="AI Inference Engine (XGBoost + LSTM)" status="OPERATIONAL" latency="140ms" ok />
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveMapPage({ selectedVillage, setSelectedVillage, mapLayers, setMapLayers, simFactors }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">LIVE MULTI-HAZARD MAP</h1>
          <p className="text-xs text-slate-400">
            Dedicated Full-Screen GIS Operational Command Interface for Spatial Risk Delineation
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">ACTIVE PROJECTION:</span>
          <span className="bg-slate-800 px-2 py-1 rounded text-blue-300 border border-slate-700">
            UTM ZONE 43N / WGS 84
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: GIS Layer Control Panel (3 cols) */}
        <div className="lg:col-span-3 bg-[#0b1324] border border-slate-800 rounded-lg p-3.5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">GIS LAYER MANAGER</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">HAZARD OVERLAYS</div>
            <CheckboxItem
              label="Flash-Flood Risk Footprint"
              checked={mapLayers.floodRisk}
              onChange={() => setMapLayers(p => ({ ...p, floodRisk: !p.floodRisk }))}
            />
            <CheckboxItem
              label="Landslide Susceptibility Zones"
              checked={mapLayers.landslideRisk}
              onChange={() => setMapLayers(p => ({ ...p, landslideRisk: !p.landslideRisk }))}
            />
            <CheckboxItem
              label="Rainfall Isohyet Contours"
              checked={mapLayers.rainfall}
              onChange={() => setMapLayers(p => ({ ...p, rainfall: !p.rainfall }))}
            />
            <CheckboxItem
              label="Soil Saturation Grids (0-100%)"
              checked={mapLayers.soilMoisture}
              onChange={() => setMapLayers(p => ({ ...p, soilMoisture: !p.soilMoisture }))}
            />
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">HYDROLOGICAL FEATURES</div>
            <CheckboxItem
              label="Stream Network & Confluences"
              checked={mapLayers.waterLevel}
              onChange={() => setMapLayers(p => ({ ...p, waterLevel: !p.waterLevel }))}
            />
            <CheckboxItem
              label="Catchment C-14 Boundaries"
              checked={mapLayers.catchmentBounds}
              onChange={() => setMapLayers(p => ({ ...p, catchmentBounds: !p.catchmentBounds }))}
            />
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">EXPOSURE & ASSETS</div>
            <CheckboxItem
              label="Habitations & Ward Boundaries"
              checked={mapLayers.villages}
              onChange={() => setMapLayers(p => ({ ...p, villages: !p.villages }))}
            />
            <CheckboxItem
              label="Roads (SH-12) & Bridges (B2, B3)"
              checked={mapLayers.roadsBridges}
              onChange={() => setMapLayers(p => ({ ...p, roadsBridges: !p.roadsBridges }))}
            />
            <CheckboxItem
              label="IoT Telemetry Stations"
              checked={mapLayers.sensors}
              onChange={() => setMapLayers(p => ({ ...p, sensors: !p.sensors }))}
            />
          </div>

          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div className="font-bold text-white">OP-NOTE:</div>
            <div>Multi-hazard intersection highlights red where both Flood Prob &gt; 70% AND Landslide &gt; 65/100 occur.</div>
          </div>
        </div>

        {/* Center: Dedicated Full GIS Map Display (6 cols) */}
        <div className="lg:col-span-6 bg-[#070e1c] border border-slate-800 rounded-lg p-3 flex flex-col justify-between min-h-[580px] relative">
          <div className="flex justify-between items-center bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded z-10 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-slate-200">COORDS: 31°06'17"N 77°10'24"E</span>
            </div>
            <div className="text-slate-400 text-[11px]">ELEV: 1,840 m ASL</div>
          </div>

          {/* Visual Tactical Map Render Area */}
          <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
            <div className="w-full h-full border border-blue-900/30 rounded relative flex items-center justify-center">
              {/* Radial Topo Contours */}
              <div className="w-80 h-80 rounded-full border border-blue-800/20 absolute"></div>
              <div className="w-[450px] h-[450px] rounded-full border border-blue-800/10 absolute"></div>

              {/* High Hazard Critical Polygon Highlight */}
              <div className="w-64 h-56 bg-red-950/20 border-2 border-red-600/70 rounded-[40px] absolute transform -rotate-12 flex items-center justify-center">
                <span className="text-[10px] font-mono font-bold text-red-400 bg-slate-950/80 px-2 py-0.5 rounded border border-red-800">
                  C-14 CRITICAL INUNDATION ZONE
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Village Points */}
          <div className="relative z-10 grid grid-cols-2 gap-4 m-auto w-full max-w-lg">
            {VILLAGES_DATA.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVillage(v)}
                className={`p-3 rounded border text-left transition ${
                  selectedVillage.id === v.id
                    ? 'bg-slate-900 border-blue-400 shadow-lg'
                    : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <strong className="text-white">{v.name}</strong>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${getRiskBadgeClasses(v.flashFloodRisk)}`}>
                    {v.flashFloodRisk}
                  </span>
                </div>
                <div className="mt-1 text-[10px] text-slate-400">
                  Catchment: {v.catchment} | Pop: {v.population}
                </div>
              </button>
            ))}
          </div>

          {/* Bottom GIS Risk Legend Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between bg-slate-900/90 border border-slate-800 px-3 py-2 rounded text-xs">
            <span className="text-slate-400 text-[11px] font-bold">RISK CLASSIFICATION:</span>
            <div className="flex items-center space-x-3 text-[11px]">
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-emerald-500 rounded"></span>
                <span className="text-slate-300">LOW (0–39%)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-amber-500 rounded"></span>
                <span className="text-slate-300">MODERATE (40–69%)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-orange-500 rounded"></span>
                <span className="text-slate-300">HIGH (70–84%)</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-red-600 rounded"></span>
                <span className="text-slate-300">VERY HIGH (&gt;85%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Selected Feature Dossier (3 cols) */}
        <div className="lg:col-span-3 bg-[#0b1324] border border-slate-800 rounded-lg p-3.5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">FEATURE ATTRIBUTES</h3>
            <span className="text-[10px] font-mono text-blue-400">{selectedVillage.id}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-base font-bold text-white">{selectedVillage.name}</div>
            <div className="text-slate-400 text-[11px]">Administrative Ward Sector, Catchment {selectedVillage.catchment}</div>

            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Terrain Gradient:</span>
                <span className="text-white font-bold">{selectedVillage.slopeAngle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flow Acc:</span>
                <span className="text-white font-bold">{selectedVillage.flowAccumulation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Water Depth:</span>
                <span className="text-red-400 font-bold">{selectedVillage.waterLevelValue}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Soil Moisture:</span>
                <span className="text-amber-400 font-bold">{selectedVillage.soilMoisture}%</span>
              </div>
            </div>

            <div className="text-[11px] font-bold text-slate-300 pt-1">EXPOSED INFRASTRUCTURE:</div>
            <ul className="space-y-1 text-[11px] text-slate-400">
              {selectedVillage.criticalAssets.map((asset, i) => (
                <li key={i} className="flex items-center space-x-1.5">
                  <span className="text-red-400">■</span>
                  <span>{asset}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-slate-800">
              <div className="text-[10px] text-slate-500 font-mono">MAP TILES SOURCE:</div>
              <div className="text-[11px] text-slate-300">ISRO Bhuvan / Survey of India Open Series Maps</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RainfallIntelligencePage({ selectedVillage, simFactors }) {
  const current1h = Math.round(selectedVillage.rainfall1h * simFactors.rainMult);
  const current6h = Math.round(selectedVillage.rainfall6h * simFactors.rainMult);

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">RAINFALL INTELLIGENCE</h1>
          <p className="text-xs text-slate-400">
            Temporal precipitation hyetographs, upstream accumulation & hydrological threshold monitoring
          </p>
        </div>
        <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded font-mono text-slate-300">
          Source: IMD AWS Network + High-Resolution Convective Ensemble
        </div>
      </div>

      {/* Precipitation Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <RainMetricCard label="RAINFALL 1h" val={`${current1h} mm`} status="Extreme Intensity" alert={current1h > 50} />
        <RainMetricCard label="RAINFALL 3h" val={`${Math.round(current1h * 1.8)} mm`} status="Accumulating" alert={current1h > 40} />
        <RainMetricCard label="RAINFALL 6h" val={`${current6h} mm`} status="Threshold Breach" alert={current6h > 100} />
        <RainMetricCard label="RAINFALL 12h" val="154 mm" status="High Runoff" />
        <RainMetricCard label="RAINFALL 24h" val="212 mm" status="Critical Antecedent" alert />
      </div>

      {/* Visual Chart and Rainfall Trigger Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Rainfall Intensity Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1324] border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              PRECIPITATION ACCUMULATION VS FLOOD TRIGGER LINE
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">STATION RG-104 (UPPER RIDGE)</span>
          </div>

          <div className="h-64 flex flex-col justify-between bg-slate-950/60 p-4 rounded border border-slate-800 relative">
            {/* Runoff Threshold Line */}
            <div className="absolute top-1/4 left-0 right-0 border-b border-red-500 border-dashed z-10 flex justify-end pr-2">
              <span className="text-[9px] bg-red-950 text-red-300 px-1.5 py-0.5 rounded border border-red-700 font-mono">
                CRITICAL FLASH FLOOD TRIGGER: 50 mm/h
              </span>
            </div>

            <div className="flex-1 flex items-end justify-between gap-3 pt-8 pb-4 border-b border-slate-700">
              <BarGraphCol height="25%" label="00:00" val="8mm" />
              <BarGraphCol height="30%" label="04:00" val="12mm" />
              <BarGraphCol height="42%" label="08:00" val="24mm" />
              <BarGraphCol height="65%" label="12:00" val="38mm" />
              <BarGraphCol height="82%" label="16:00" val="54mm" highlight />
              <BarGraphCol height="96%" label="20:00 (Now)" val={`${current1h}mm`} alert />
              <BarGraphCol height="55%" label="+2h Fcst" val="40mm" forecast />
            </div>

            <div className="flex justify-between text-[11px] text-slate-400 pt-2 font-mono">
              <span>Antecedent Rainfall (5-day): 284 mm</span>
              <span className="text-amber-400 font-bold">Soil Pre-saturation: 84% (Very High)</span>
            </div>
          </div>
        </div>

        {/* Catchment Trigger Analysis (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b1324] border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              RAINFALL TRIGGER ANALYSIS (WHY CATCHMENT IS REACTING)
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-red-950/30 border border-red-800 rounded space-y-1">
              <div className="font-bold text-red-300">1. OROGRAPHIC CLOUD ANCHORING</div>
              <div className="text-slate-300 text-[11px]">
                Strong south-westerly moisture flux colliding with the 2,200m C-14 ridge crest, generating hyper-localized convective cells exceeding 60mm/h.
              </div>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-800 rounded space-y-1">
              <div className="font-bold text-amber-300">2. INFILTRATION EXCESS RUNOFF</div>
              <div className="text-slate-300 text-[11px]">
                High antecedent rainfall over 72 hours has exhausted the soil water holding capacity. Infiltration rate has dropped from 40mm/h to 6mm/h, converting 85% of rainfall directly to surface runoff.
              </div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded space-y-1 font-mono text-[11px]">
              <div className="text-slate-400">HYDROLOGICAL COEFFICIENTS:</div>
              <div className="flex justify-between text-slate-300">
                <span>Runoff Coefficient (C):</span>
                <span className="font-bold text-red-400">0.82 (Extreme)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Time of Concentration (Tc):</span>
                <span className="font-bold text-white">42 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CatchmentIntelligencePage({ selectedVillage, simFactors }) {
  return (
    <div className="space-y-5">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">CATCHMENT INTELLIGENCE</h1>
          <p className="text-xs text-slate-400">
            Watershed hydrological flow cascading from ridge precipitation to downstream village exposure
          </p>
        </div>
        <div className="text-xs bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1.5 rounded font-mono font-bold">
          FOCUS WATERSHED: CATCHMENT C-14
        </div>
      </div>

      {/* Five-Stage Visual Flow Hierarchy (SIH Requirement) */}
      <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          HYDROLOGICAL CHAIN OF CAUSATION:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <FlowStep
            step="1"
            title="UPSTREAM RAINFALL"
            metric="62 mm / 1h"
            sub="Convective storm over ridge"
            color="border-blue-700 bg-blue-950/40 text-blue-300"
          />
          <FlowStep
            step="2"
            title="CATCHMENT RESPONSE"
            metric="84% Soil Sat."
            sub="Infiltration capacity exhausted"
            color="border-amber-700 bg-amber-950/40 text-amber-300"
          />
          <FlowStep
            step="3"
            title="SURFACE RUNOFF"
            metric="C = 0.82"
            sub="Excess sheet flow generated"
            color="border-orange-700 bg-orange-950/40 text-orange-300"
          />
          <FlowStep
            step="4"
            title="STREAM SURGE"
            metric="3.8m (Rising)"
            sub="Bridge B-02 river intake"
            color="border-red-700 bg-red-950/40 text-red-300"
          />
          <FlowStep
            step="5"
            title="DOWNSTREAM VILLAGE"
            metric="ABC Village"
            sub="Lead Time: 1–3 Hours"
            color="border-red-600 bg-red-900/40 text-white font-bold"
          />
        </div>
      </div>

      {/* Catchment Parameters Table & Downstream Exposure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            WATERSHED MORPHOMETRY (C-14)
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <DataRow label="Catchment Area" val="48.6 km²" />
            <DataRow label="Mean Slope Gradient" val="34.2° (Steep mountainous)" />
            <DataRow label="Drainage Density" val="3.84 km / km² (High stream frequency)" />
            <DataRow label="Flow Accumulation Index" val="4,210,000 cells (Extreme convergence)" />
            <DataRow label="Main Stream Channel Length" val="14.8 km" />
            <DataRow label="Hypsometric Integral (HI)" val="0.58 (Youthful dissected stage)" />
            <DataRow label="Hydrology Model" val="HEC-HMS Distributed Hydrodynamic" />
          </div>
        </div>

        <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            DOWNSTREAM IMPACT ZONES & EXPOSED UNITS
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-white">ABC Village Habitation</strong>
                <div className="text-[11px] text-slate-400">1,420 Residents • 240 Structures in 25-yr floodplain</div>
              </div>
              <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-700 font-bold">
                PRIORITY 1
              </span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-white">Bridge B-02 (State Highway SH-12)</strong>
                <div className="text-[11px] text-slate-400">Critical Valley Transit Arterial • Freeboard &lt; 0.7m</div>
              </div>
              <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-700 font-bold">
                SUBMERGENCE RISK
              </span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
              <div>
                <strong className="text-white">Tehri Valley Agricultural Hamlet</strong>
                <div className="text-[11px] text-slate-400">Terraced farmlands along secondary feeder</div>
              </div>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-700 font-bold">
                PRIORITY 2
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlopeStabilityPage({ selectedVillage, simFactors }) {
  const currentSlopeScore = Math.min(98, Math.max(20, Math.round(selectedVillage.landslideSusceptibility * (simFactors.slopeScore / 72))));
  const currentMoisture = Math.min(98, Math.max(30, selectedVillage.soilMoisture + simFactors.soilDelta));

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">SLOPE STABILITY & LANDSLIDE SUSCEPTIBILITY</h1>
          <p className="text-xs text-slate-400">
            Geotechnical terrain susceptibility, shear strength degradation & pore-water pressure telemetry
          </p>
        </div>
        <div className="text-xs bg-orange-950 text-orange-300 border border-orange-800 px-3 py-1.5 rounded font-mono font-bold">
          GEOTECH ENGINE: INFINITE SLOPE FACTOR OF SAFETY
        </div>
      </div>

      {/* Primary Susceptibility Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="text-slate-400 text-xs font-bold uppercase">LANDSLIDE SUSCEPTIBILITY</div>
          <div className="text-3xl font-extrabold text-orange-400 font-mono">
            {currentSlopeScore} <span className="text-sm text-slate-400">/ 100</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded ${getRiskBadgeClasses('HIGH')}`}>
            STATUS: HIGH SLOPE SUSCEPTIBILITY
          </span>
          <p className="text-[10px] text-slate-500 pt-1">
            *Evaluated as terrain susceptibility under antecedent saturation
          </p>
        </div>

        <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="text-slate-400 text-xs font-bold uppercase">FACTOR OF SAFETY (FoS)</div>
          <div className="text-3xl font-extrabold text-red-400 font-mono">1.08</div>
          <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-700 font-bold">
            LIMIT EQUILIBRIUM BREACH (&lt; 1.10)
          </span>
        </div>

        <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="text-slate-400 text-xs font-bold uppercase">SOIL MOISTURE SATURATION</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{currentMoisture}%</div>
          <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-700 font-bold">
            SENSOR SM-204 (ONLINE)
          </span>
        </div>

        <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="text-slate-400 text-xs font-bold uppercase">SLOPE GRADIENT</div>
          <div className="text-3xl font-extrabold text-white font-mono">{selectedVillage.slopeAngle}</div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
            CRITICAL THRESHOLD: &gt; 35°
          </span>
        </div>
      </div>

      {/* Geotechnical Parameters & Contributing Factors Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            GEOTECHNICAL & GEOLOGICAL PROFILE
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <DataRow label="Bedrock Lithology" val="Weathered Phyllite & Schist (Highly Fractured)" />
            <DataRow label="Overburden Thickness" val="2.4m - 4.1m Colluvial Debris" />
            <DataRow label="Internal Friction Angle (φ)" val="26.4°" />
            <DataRow label="Effective Cohesion (c')" val="14.2 kPa" />
            <DataRow label="Pore Water Pressure (u)" val="4.2 kPa (Rising via PZ-012)" />
            <DataRow label="Historical Landslide Density" val="4.2 slides / km² (Very High)" />
          </div>
        </div>

        <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            CONTRIBUTING FACTORS WEIGHTAGE (EXPLAINABLE GEOTECH)
          </h3>
          <div className="space-y-2.5 text-xs">
            <FactorBar label="Steep Slope Gradient (> 38°)" weight={35} color="bg-red-500" />
            <FactorBar label="High Soil Saturation (84%)" weight={30} color="bg-orange-500" />
            <FactorBar label="Weathered & Sheared Phyllite Substrate" weight={20} color="bg-amber-500" />
            <FactorBar label="Historical Scarp & Road Cut Unloading" weight={15} color="bg-blue-500" />
          </div>
          <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800">
            *Note: Susceptibility map reflects deterministic terrain predisposition; dynamic trigger verified by active sensor mesh.
          </div>
        </div>
      </div>
    </div>
  );
}

function AIPredictionPage({ selectedVillage, simFactors }) {
  const currentFloodProb = Math.min(99, Math.max(10, Math.round(selectedVillage.flashFloodProb * (simFactors.floodProb / 88))));
  const currentSlopeScore = Math.min(98, Math.max(20, Math.round(selectedVillage.landslideSusceptibility * (simFactors.slopeScore / 72))));

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">AI PREDICTION & EXPLAINABILITY</h1>
          <p className="text-xs text-slate-400">
            Independent AI inference streams for Flash Floods and Landslides with model factor attribution
          </p>
        </div>
        <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded font-mono text-slate-300">
          Inference Engine: Multimodal Spatio-Temporal Graph Neural Network + XGBoost
        </div>
      </div>

      {/* TWO SEPARATED AI PANELS (Mandatory SIH Requirement - Never combine into 1 meaningless score) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PANEL 1: FLASH-FLOOD AI */}
        <div className="bg-[#0b1324] border border-blue-900/80 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start border-b border-blue-900/60 pb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">MODEL STREAM 1</span>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Waves className="w-5 h-5 text-cyan-400" />
                FLASH-FLOOD AI PREDICTOR
              </h3>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getRiskBadgeClasses('VERY HIGH')}`}>
              RISK: VERY HIGH
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900 p-3 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">Predicted Probability</div>
              <div className="text-3xl font-extrabold text-red-400 font-mono">{currentFloodProb}%</div>
            </div>
            <div className="bg-slate-900 p-3 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">Warning Lead-Time Window</div>
              <div className="text-lg font-bold text-blue-300 font-mono mt-1">Next 1–3 Hours</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              TOP MODEL FACTORS (SHAP VALUES):
            </div>
            <ShapFactor label="Upstream Convective Rain Rate (62mm/h)" impact="+0.38" positive />
            <ShapFactor label="Catchment Soil Saturation (84%)" impact="+0.26" positive />
            <ShapFactor label="High Flow Accumulation Feeder (C-14)" impact="+0.18" positive />
            <ShapFactor label="Water Level Acceleration (>0.4m/h)" impact="+0.14" positive />
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex justify-between">
            <span>Model: Flood-LSTM v3.1</span>
            <span>Feature Set: v2026.04</span>
          </div>
        </div>

        {/* PANEL 2: SLOPE-STABILITY AI */}
        <div className="bg-[#0b1324] border border-orange-900/80 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start border-b border-orange-900/60 pb-3">
            <div>
              <span className="text-[10px] font-mono text-orange-400 font-bold uppercase">MODEL STREAM 2</span>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Mountain className="w-5 h-5 text-orange-400" />
                SLOPE-STABILITY AI PREDICTOR
              </h3>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getRiskBadgeClasses('HIGH')}`}>
              RISK: HIGH
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900 p-3 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">Susceptibility Score</div>
              <div className="text-3xl font-extrabold text-orange-400 font-mono">{currentSlopeScore} / 100</div>
            </div>
            <div className="bg-slate-900 p-3 rounded border border-slate-800">
              <div className="text-slate-400 text-[10px]">Failure Mechanism</div>
              <div className="text-sm font-bold text-orange-200 mt-1">Shallow Translational Debris Slide</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              TOP MODEL FACTORS (SHAP VALUES):
            </div>
            <ShapFactor label="Steep Terrain Slope (38°)" impact="+0.32" positive />
            <ShapFactor label="High Soil Saturation (SM-204 at 84%)" impact="+0.29" positive />
            <ShapFactor label="Historical Landslide Scarp Density" impact="+0.21" positive />
            <ShapFactor label="Fractured Phyllite/Schist Weathering" impact="+0.12" positive />
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex justify-between">
            <span>Model: Slope-XGBoost v2.8</span>
            <span>Feature Set: v2026.04</span>
          </div>
        </div>
      </div>

      {/* AI Explainability & Ethical Caution Box */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-xs space-y-1 text-slate-400">
        <div className="text-white font-bold flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-400" />
          <span>GOVERNMENT EXPLAINABILITY MANDATE:</span>
        </div>
        <p>
          AI factors represent statistical model feature attributions (SHAP values) derived from historical disaster correlations and real-time sensor dynamics, not absolute physical causation proof. Decision-makers must corroborate model indicators with field telemetry and on-site DDMA observations.
        </p>
      </div>
    </div>
  );
}

function SensorNetworkPage({ simFactors }) {
  const [filterType, setFilterType] = useState('ALL');

  const filteredSensors = useMemo(() => {
    if (filterType === 'ALL') return IOT_SENSORS_DATA;
    return IOT_SENSORS_DATA.filter(s => s.type.toLowerCase().includes(filterType.toLowerCase()));
  }, [filterType]);

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">REAL-TIME IoT SENSOR NETWORK</h1>
          <p className="text-xs text-slate-400">
            Telemetry mesh monitoring tipping-bucket rain gauges, capacitive soil moisture probes & FMCW water level radar
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Filter:</span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-2 py-1 text-xs rounded ${filterType === 'ALL' ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('Rain')}
            className={`px-2 py-1 text-xs rounded ${filterType === 'Rain' ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Rain
          </button>
          <button
            onClick={() => setFilterType('Soil')}
            className={`px-2 py-1 text-xs rounded ${filterType === 'Soil' ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Soil
          </button>
          <button
            onClick={() => setFilterType('Water')}
            className={`px-2 py-1 text-xs rounded ${filterType === 'Water' ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            Radar
          </button>
        </div>
      </div>

      {/* Transparent Labeling Banner (SIH Rule: Never present simulated data as real govt sensors) */}
      <div className="p-3 bg-amber-950/40 border border-amber-800 rounded-lg text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2 text-amber-200">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            DATA MODE: <strong>SIMULATED IoT TELEMETRY</strong> for Smart India Hackathon 2026 live demonstration. Sensor nodes communicate via LoRaWAN / Cellular telemetry emulation.
          </span>
        </div>
        <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">
          REFRESH: 5s POLLING
        </span>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSensors.map(sensor => (
          <div key={sensor.id} className="bg-[#0b1324] border border-slate-800 rounded-lg p-3.5 space-y-2.5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold">{sensor.id}</span>
                <h4 className="text-sm font-bold text-white">{sensor.type}</h4>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                sensor.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                sensor.status === 'WARNING' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                'bg-red-950 text-red-300 border border-red-700'
              }`}>
                {sensor.status}
              </span>
            </div>

            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between items-center font-mono">
              <span className="text-slate-400 text-xs">{sensor.location}</span>
              <span className="text-lg font-bold text-white">{sensor.val}</span>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
              <span>Updated: {sensor.lastUpdate}</span>
              <span className="text-amber-400 bg-slate-900 px-1 rounded border border-slate-800">{sensor.mode}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EarlyWarningsPage({ selectedVillage, simFactors, acknowledgedAlerts, onAcknowledge }) {
  const currentFloodProb = Math.min(99, Math.max(10, Math.round(selectedVillage.flashFloodProb * (simFactors.floodProb / 88))));
  const currentSlopeScore = Math.min(98, Math.max(20, Math.round(selectedVillage.landslideSusceptibility * (simFactors.slopeScore / 72))));

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">EARLY WARNING & ALERT CENTER</h1>
          <p className="text-xs text-slate-400">
            Actionable disaster warning bulletins, exposed community asset tracking & operational response dispatch
          </p>
        </div>
        <div className="text-xs bg-red-950 text-red-300 border border-red-800 px-3 py-1.5 rounded font-mono font-bold">
          PROTOCOL: NDMA HILLY TERRAIN SOP ACTIVE
        </div>
      </div>

      {/* Main Multi-Hazard Warning Bulletin Card */}
      <div className="bg-[#0b1324] border-2 border-red-700 rounded-lg p-5 shadow-2xl space-y-4">
        <div className="flex flex-wrap justify-between items-start gap-2 border-b border-red-900/60 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-900/80 rounded border border-red-600">
              <ShieldAlert className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold">
                OFFICIAL BULLETIN #DDMA-C14-2026-09
              </span>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
                MULTI-HAZARD WARNING: ABC VILLAGE & BRIDGE B-02 CONFLUENCE
              </h2>
            </div>
          </div>
          <span className="bg-red-900 text-white font-extrabold px-3 py-1 text-xs rounded border border-red-500 tracking-wider">
            SEVERITY: CRITICAL / LEVEL 3
          </span>
        </div>

        {/* Separated Hazard Metrics within the bulletin */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/90 p-3 rounded border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">FLASH-FLOOD RISK</span>
            <span className="text-red-400 font-extrabold text-base">VERY HIGH ({currentFloodProb}%)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">LANDSLIDE RISK</span>
            <span className="text-orange-400 font-extrabold text-base">HIGH ({currentSlopeScore}/100)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">WARNING WINDOW</span>
            <span className="text-blue-300 font-bold text-base">Next 1–3 Hours</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">EXPOSED ASSETS</span>
            <span className="text-white font-bold text-base">Bridge B2, Road SH-12</span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="text-slate-300">
            <strong className="text-white">TRIGGER REASON: </strong>
            Intense upstream convective precipitation (62 mm/h) coinciding with 84% pre-saturated colluvial slope, causing rapid stream level surge (3.8m) at Bridge B-02 intake.
          </div>
          <div className="p-3 bg-amber-950/40 border border-amber-800 rounded text-amber-200">
            <strong>RECOMMENDED DECISION SUPPORT ACTION: </strong>
            Follow authority-defined preparedness and evacuation procedures. Pre-alert downstream ward volunteers, divert heavy traffic from State Highway SH-12 at KM 41, and inspect Bridge B-02 girder clearance.
          </div>
        </div>

        {/* Command Buttons */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 font-mono">
            Created: 14 minutes ago • Dispatched to District Control Room & SDRF 3rd Bn
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onAcknowledge('WARN-01')}
              disabled={acknowledgedAlerts['WARN-01']}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition ${
                acknowledgedAlerts['WARN-01']
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600'
                  : 'bg-red-700 hover:bg-red-600 text-white'
              }`}
            >
              {acknowledgedAlerts['WARN-01'] ? '✓ ACKNOWLEDGED BY EOC' : 'ACKNOWLEDGE WARNING'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoricalEventsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = useMemo(() => {
    return HISTORICAL_DISASTERS.filter(item =>
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hazard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.year.includes(searchTerm)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">HISTORICAL DISASTER EVENTS</h1>
          <p className="text-xs text-slate-400">
            Validated catalog of historical cloudbursts, flash floods and debris flows in Catchment C-14 & C-15
          </p>
        </div>
        <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded font-mono text-slate-300">
          Source: Geological Survey of India (GSI) & State Disaster Management Archives
        </div>
      </div>

      <div className="flex items-center space-x-3 bg-[#0b1324] border border-slate-800 p-2.5 rounded-lg">
        <Search className="w-4 h-4 text-slate-400 ml-1" />
        <input
          type="text"
          placeholder="Filter by year, location, hazard type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
        />
      </div>

      {/* Historical Records Table */}
      <div className="bg-[#0b1324] border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
            <tr>
              <th className="p-3">EVENT ID</th>
              <th className="p-3">DATE</th>
              <th className="p-3">LOCATION</th>
              <th className="p-3">HAZARD PHENOMENON</th>
              <th className="p-3">24h RAIN</th>
              <th className="p-3">RETURN PERIOD</th>
              <th className="p-3">DOCUMENTED IMPACT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 text-slate-300">
            {filteredHistory.map(event => (
              <tr key={event.id} className="hover:bg-slate-850">
                <td className="p-3 font-mono font-bold text-blue-400">{event.id}</td>
                <td className="p-3 font-mono">{event.month} {event.year}</td>
                <td className="p-3 font-semibold text-white">{event.location}</td>
                <td className="p-3">
                  <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded text-[10px]">
                    {event.hazard}
                  </span>
                </td>
                <td className="p-3 font-mono">{event.rainfall24h}</td>
                <td className="p-3 font-mono text-amber-400">{event.returnPeriod}</td>
                <td className="p-3 text-[11px] text-slate-400">{event.damage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SimulationPage({ simulationStage, setSimulationStage, isSimulating, setIsSimulating, simFactors }) {
  return (
    <div className="space-y-5">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">MULTI-HAZARD EVENT SIMULATOR</h1>
          <p className="text-xs text-slate-400">
            SIH26192 Evaluator Demonstration: Synthesize chronological disaster progression from baseline to critical warning
          </p>
        </div>
        <div className="text-xs bg-amber-950 text-amber-300 border border-amber-800 px-3 py-1.5 rounded font-mono font-bold">
          EVALUATOR TEST BENCH ACTIVE
        </div>
      </div>

      {/* Simulator Master Controls */}
      <div className="bg-[#0b1324] border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition ${
                isSimulating
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isSimulating ? 'PAUSE AUTOMATED RUN' : 'START LIVE SIMULATION'}</span>
            </button>

            <button
              onClick={() => {
                setIsSimulating(false);
                setSimulationStage(1);
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-bold flex items-center space-x-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET TO BASELINE</span>
            </button>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="text-slate-400">SIMULATION ENGINE: </span>
            <strong className="text-blue-300">ACTIVE DYNAMIC HYDRO-GEOTECH INTERPOLATION</strong>
          </div>
        </div>

        {/* Five Interactive Stage Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          <StageBtn
            num="1"
            title="NORMAL"
            desc="Baseline rain & stable slope"
            active={simulationStage === 1}
            onClick={() => { setIsSimulating(false); setSimulationStage(1); }}
          />
          <StageBtn
            num="2"
            title="HEAVY RAIN"
            desc="Precipitation rate climbs"
            active={simulationStage === 2}
            onClick={() => { setIsSimulating(false); setSimulationStage(2); }}
          />
          <StageBtn
            num="3"
            title="SATURATION"
            desc="Soil capacity breaches"
            active={simulationStage === 3}
            onClick={() => { setIsSimulating(false); setSimulationStage(3); }}
          />
          <StageBtn
            num="4"
            title="RAPID RESPONSE"
            desc="Stream radar surges"
            active={simulationStage === 4}
            onClick={() => { setIsSimulating(false); setSimulationStage(4); }}
          />
          <StageBtn
            num="5"
            title="CRITICAL WARNING"
            desc="Village Level 3 broadcast"
            active={simulationStage === 5}
            onClick={() => { setIsSimulating(false); setSimulationStage(5); }}
          />
        </div>

        {/* Live Simulator Response Output */}
        <div className="p-4 bg-slate-900/90 rounded border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center text-sm font-bold font-mono">
            <span className="text-white">{simFactors.label}</span>
            <span className={`px-2 py-0.5 rounded text-xs ${getRiskBadgeClasses(simFactors.risk)}`}>
              SYSTEM HAZARD: {simFactors.risk}
            </span>
          </div>
          <p className="text-slate-300 text-xs">
            Notice how changing stages dynamically scales rainfall telemetry, soil saturation percentages, stream water levels, AI flood probabilities, and slope susceptibility ratings across the entire Command Center and Map in real time.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReportsPage({ selectedVillage }) {
  return (
    <div className="space-y-5">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">REPORTS & DECISION SUPPORT</h1>
          <p className="text-xs text-slate-400">
            Generate standardized situational assessment reports for District Disaster Management Authorities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>PRINT DOSSIER</span>
          </button>
          <button
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT PDF REPORT</span>
          </button>
        </div>
      </div>

      {/* Official Report Preview Container */}
      <div className="bg-[#0b1324] border border-slate-700 rounded-lg p-6 max-w-4xl mx-auto space-y-5 text-slate-200 shadow-xl">
        <div className="border-b-2 border-slate-700 pb-4 flex justify-between items-start">
          <div>
            <div className="text-[11px] font-mono text-blue-400 font-bold uppercase">
              DISTRICT DISASTER MANAGEMENT AUTHORITY (DDMA) SITUATION REPORT
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide mt-1">
              HYPER-LOCAL MULTI-HAZARD ASSESSMENT: {selectedVillage.name.toUpperCase()}
            </h2>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              WATERSHED: CATCHMENT {selectedVillage.catchment} • GENERATED AT: {new Date().toLocaleDateString('en-IN')}
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-900 border border-slate-700 px-3 py-1 rounded text-amber-300">
            REF: SITREP-2026/09
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs bg-slate-900/90 p-3 rounded border border-slate-800">
          <div>
            <span className="text-slate-500 block text-[10px]">FLASH-FLOOD PROB</span>
            <span className="font-bold text-red-400 text-sm">{selectedVillage.flashFloodProb}%</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">LANDSLIDE SUSCEPTIBILITY</span>
            <span className="font-bold text-orange-400 text-sm">{selectedVillage.landslideSusceptibility} / 100</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">POPULATION AT RISK</span>
            <span className="font-bold text-white text-sm">{selectedVillage.population} Persons</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">CRITICAL INFRASTRUCTURE</span>
            <span className="font-bold text-white text-sm">Bridge B-02 / SH-12</span>
          </div>
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-1">
            EXECUTIVE DISASTER BRIEFING
          </h4>
          <p className="text-slate-300">
            A critical multi-hazard situation exists within {selectedVillage.name}, situated along the main drainage thread of Catchment {selectedVillage.catchment}. Antecedent rainfall has saturated the colluvial veneer on the 38° slopes, simultaneously increasing the susceptibility of shallow debris slides while reducing catchment infiltration to generate severe surface runoff toward Bridge B-02.
          </p>

          <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-1 pt-2">
            FIELD DIRECTIVES FOR DISTRICT MAGISTRATE / SDRF
          </h4>
          <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
            <li>Pre-position inflatable response craft and rescue tenders at tehsil depot.</li>
            <li>Issue advisory to restrict non-essential vehicular traffic on State Highway SH-12 at KM 41.</li>
            <li>Maintain hourly physical telemetry check on Bridge B-02 freeboard until FMCW radar indicates recession.</li>
          </ul>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>SYSTEM: NATIONAL MULTI-HAZARD EARLY WARNING PLATFORM (SIH26192)</span>
          <span>NO UNAUTHORIZED MODIFICATIONS PERMITTED</span>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, val, status, icon: Icon, trend, badgeColor, alertPulse }) {
  return (
    <div className={`bg-[#0b1324] border rounded-lg p-3 space-y-1.5 transition-all ${
      alertPulse ? 'border-red-600/90 shadow-red-950/50 shadow-md ring-1 ring-red-500/30' : 'border-slate-800'
    }`}>
      <div className="flex justify-between items-start">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{title}</span>
        <Icon className={`w-4 h-4 ${badgeColor}`} />
      </div>
      <div className="text-2xl font-black tracking-tight text-white font-mono">{val}</div>
      <div className="text-[10px] text-slate-300 truncate font-medium">{status}</div>
      <div className="text-[9px] text-slate-500 font-mono pt-1 border-t border-slate-800/60 truncate">
        {trend}
      </div>
    </div>
  );
}

function LayerToggle({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded border text-[11px] font-medium transition flex items-center space-x-1.5 ${
        active ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${active ? color.replace('text-', 'bg-') : 'bg-slate-700'}`}></span>
      <span>{label}</span>
    </button>
  );
}

function CheckboxItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center space-x-2 text-slate-300 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
      />
      <span className="text-xs">{label}</span>
    </label>
  );
}

function BarGraphCol({ height, label, val, highlight, alert, forecast }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
      <span className="text-[9px] font-mono text-slate-400">{val}</span>
      <div
        style={{ height }}
        className={`w-full rounded-t transition-all ${
          alert ? 'bg-red-500' :
          highlight ? 'bg-blue-500' :
          forecast ? 'bg-purple-600/70 border-t-2 border-purple-400' :
          'bg-slate-700'
        }`}
      ></div>
      <span className="text-[9px] font-mono text-slate-400 text-center">{label}</span>
    </div>
  );
}

function AlertItemMini({ title, loc, time, sev, action }) {
  return (
    <div className="p-2 bg-slate-900/90 border border-slate-800 rounded space-y-1 text-xs">
      <div className="flex justify-between items-center">
        <span className="font-bold text-white">{title}</span>
        <span className="text-[9px] bg-red-950 text-red-300 px-1 rounded border border-red-800 font-mono">{sev}</span>
      </div>
      <div className="text-[11px] text-blue-300">{loc} • <span className="text-slate-500 font-mono">{time}</span></div>
      <div className="text-[10px] text-slate-400 truncate">{action}</div>
    </div>
  );
}

function HealthItem({ title, status, latency, ok }) {
  return (
    <div className="flex justify-between items-center p-1.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px]">
      <span className="text-slate-300">{title}</span>
      <div className="flex items-center space-x-2">
        <span className="text-slate-500 text-[10px]">{latency}</span>
        <span className={`text-[10px] font-bold ${ok ? 'text-emerald-400' : 'text-red-400'}`}>{status}</span>
      </div>
    </div>
  );
}

function RainMetricCard({ label, val, status, alert }) {
  return (
    <div className={`p-3 rounded-lg border bg-[#0b1324] space-y-1 ${alert ? 'border-red-700/80' : 'border-slate-800'}`}>
      <span className="text-[10px] uppercase font-bold text-slate-400">{label}</span>
      <div className="text-xl font-bold font-mono text-white">{val}</div>
      <span className={`text-[10px] font-semibold ${alert ? 'text-red-400' : 'text-slate-400'}`}>{status}</span>
    </div>
  );
}

function FlowStep({ step, title, metric, sub, color }) {
  return (
    <div className={`p-3 rounded border space-y-1.5 ${color}`}>
      <div className="text-[10px] font-mono font-bold">STEP {step}</div>
      <div className="font-bold text-xs">{title}</div>
      <div className="text-base font-extrabold font-mono">{metric}</div>
      <div className="text-[10px] opacity-80">{sub}</div>
    </div>
  );
}

function DataRow({ label, val }) {
  return (
    <div className="flex justify-between py-1 border-b border-slate-800/70">
      <span className="text-slate-400">{label}:</span>
      <span className="font-bold text-white">{val}</span>
    </div>
  );
}

function FactorBar({ label, weight, color }) {
  return (
    <div className="space-y-1 font-mono text-xs">
      <div className="flex justify-between text-slate-300">
        <span>{label}</span>
        <span className="font-bold">{weight}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div style={{ width: `${weight}%` }} className={`h-full ${color}`}></div>
      </div>
    </div>
  );
}

function ShapFactor({ label, impact, positive }) {
  return (
    <div className="flex justify-between items-center p-1.5 bg-slate-900 rounded border border-slate-800 font-mono text-xs">
      <span className="text-slate-300">{label}</span>
      <span className={`font-bold ${positive ? 'text-red-400' : 'text-emerald-400'}`}>{impact}</span>
    </div>
  );
}

function StageBtn({ num, title, desc, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded border text-left transition ${
        active
          ? 'bg-blue-900/60 border-blue-400 ring-2 ring-blue-500/40'
          : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800'
      }`}
    >
      <div className="text-[10px] font-mono text-blue-400 font-bold">STAGE {num}</div>
      <div className="text-xs font-bold text-white">{title}</div>
      <div className="text-[10px] text-slate-400 mt-1">{desc}</div>
    </button>
  );
}