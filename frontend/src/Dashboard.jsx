import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Bell, X, Camera, Activity, Shield, Zap, Eye, Radio, Heart, Wind, Volume2, Clock } from 'lucide-react';

const ThreatDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [systemStatus, setSystemStatus] = useState('initializing');

  useEffect(() => {
    // Simulate system initialization
    setTimeout(() => setSystemStatus('active'), 1000);
    
    // Try to connect to WebSocket
    try {
      const ws = new WebSocket('ws://localhost:8000/ws');
      
      ws.onopen = () => {
        setIsConnected(true);
        setSystemStatus('active');
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'threat_decision') {
          setAlerts(prev => [data, ...prev].slice(0, 10));
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
      };

      return () => ws.close();
    } catch (error) {
      setIsConnected(false);
      // Generate demo alert for showcase
      generateDemoAlert();
    }
  }, []);

  const generateDemoAlert = () => {
    setTimeout(() => {
      const demoAlert = {
        id: Date.now(),
        timestamp: Date.now() / 1000,
        threat_level: 'high',
        decision: {
          message_to_user: 'Unusual activity detected at front entrance',
          reasoning: 'Motion sensor triggered after hours with unfamiliar heat signature',
          call_911: false,
          notify_contacts: true,
          evidence: ['Motion detected at 23:45', 'Unknown heat signature', 'Door sensor activated']
        }
      };
      setAlerts([demoAlert]);
      setDevices([
        { name: 'Smartwatch', online: true, id: 1 },
        { name: 'Wearable', online: true, id: 2 },
        { name: 'Microphone', online: true, id: 3 },
        { name: 'Smoke Detector', online: true, id: 4 }
      ]);
    }, 2000);
  };

  const handleCall911 = (incident) => {
    alert(`🚨 Calling 911 for incident: ${incident.id}`);
  };

  const handleNotifyContact = (incident) => {
    alert(`📱 Notifying emergency contact for: ${incident.id}`);
  };

  const getThreatColor = (level) => {
    const colors = {
      critical: 'bg-red-600',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500',
      none: 'bg-green-500'
    };
    return colors[level] || colors.none;
  };

  const getThreatGlow = (level) => {
    const glows = {
      critical: 'shadow-[0_0_30px_rgba(239,68,68,0.5)]',
      high: 'shadow-[0_0_25px_rgba(249,115,22,0.4)]',
      medium: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
      low: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
      none: 'shadow-[0_0_10px_rgba(16,185,129,0.2)]'
    };
    return glows[level] || glows.none;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header with Glassmorphism */}
        <div className="mb-8 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Shield className="w-12 h-12 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Home Threat Detection
                </h1>
                <p className="text-gray-400 flex items-center gap-2 mt-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  AI-Powered Security Intelligence
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className={`backdrop-blur-md bg-white/10 rounded-full px-4 py-2 flex items-center gap-2 border border-white/20 ${
                isConnected ? 'shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''
              }`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Offline'}</span>
              </div>
              
              <div className="backdrop-blur-md bg-white/10 rounded-full px-4 py-2 flex items-center gap-2 border border-white/20">
                <Activity className={`w-4 h-4 ${systemStatus === 'active' ? 'text-green-400' : 'text-yellow-400'}`} />
                <span className="text-sm font-medium capitalize">{systemStatus}</span>
              </div>
              
              <div className="backdrop-blur-md bg-white/10 rounded-full px-4 py-2 flex items-center gap-2 border border-white/20">
                <Camera className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">5 Cameras</span>
              </div>
              
              <div className={`backdrop-blur-md bg-white/10 rounded-full px-4 py-2 flex items-center gap-2 border border-white/20 ${
                alerts.length > 0 ? 'animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]' : ''
              }`}>
                <AlertTriangle className={`w-4 h-4 ${alerts.length > 0 ? 'text-red-400' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">{alerts.length} Alerts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Alerts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alert Feed */}
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg">
                  <Bell className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold">Active Alerts</h2>
                {alerts.length > 0 && (
                  <span className="ml-auto px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold border border-red-500/30">
                    {alerts.length} Active
                  </span>
                )}
              </div>
              
              {alerts.length === 0 && (
                <div className="text-center py-12">
                  <div className="relative inline-block">
                    <Shield className="w-20 h-20 text-green-400/30 mx-auto mb-4" />
                    <div className="absolute inset-0 bg-green-400/10 rounded-full blur-2xl animate-pulse"></div>
                  </div>
                  <p className="text-gray-400 text-lg font-medium">All Systems Secure</p>
                  <p className="text-gray-500 text-sm mt-2">No active threats detected</p>
                </div>
              )}

              <div className="space-y-4">
                {alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`backdrop-blur-md bg-white/5 rounded-xl p-5 border-l-4 cursor-pointer hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] ${
                      getThreatColor(alert.threat_level)
                    } ${getThreatGlow(alert.threat_level)}`}
                    onClick={() => setSelectedIncident(alert)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getThreatColor(alert.threat_level)} bg-opacity-20`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-bold text-lg uppercase tracking-wide">
                            {alert.threat_level} Threat
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {new Date(alert.timestamp * 1000).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-200 mb-4 leading-relaxed">
                      {alert.decision?.message_to_user || alert.decision?.reasoning}
                    </p>
                    
                    <div className="flex gap-2 flex-wrap">
                      {alert.decision?.call_911 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCall911(alert);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105"
                        >
                          <Phone className="w-4 h-4" />
                          Call 911
                        </button>
                      )}
                      
                      {alert.decision?.notify_contacts && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotifyContact(alert);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-105"
                        >
                          <Bell className="w-4 h-4" />
                          Notify Contact
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAlerts(prev => prev.filter((_, i) => i !== idx));
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all backdrop-blur-sm"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Camera Grid */}
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                  <Camera className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold">Live Camera Feeds</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map(camId => (
                  <div
                    key={camId}
                    className="group relative backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:scale-105 cursor-pointer"
                  >
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 bg-green-500/80 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        CAM {camId}
                      </span>
                    </div>
                    
                    <div className="absolute top-3 right-3 z-10">
                      <Radio className="w-4 h-4 text-green-400 animate-pulse" />
                    </div>
                    
                    <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden group-hover:from-slate-700 group-hover:to-slate-800 transition-all">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Camera className="w-12 h-12 text-gray-600 group-hover:text-cyan-500/50 transition-colors" />
                      <Eye className="w-6 h-6 text-cyan-400/50 absolute bottom-2 right-2 group-hover:scale-110 transition-transform" />
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-medium">Feed Active</span>
                      <span className="text-xs text-green-400 font-bold">1080p</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Device Status */}
          <div className="space-y-6">
            {/* Device Status */}
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold">Sensor Network</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Smartwatch', icon: Heart, color: 'text-red-400', bgColor: 'from-red-500/20' },
                  { name: 'Wearable', icon: Activity, color: 'text-blue-400', bgColor: 'from-blue-500/20' },
                  { name: 'Microphone', icon: Volume2, color: 'text-purple-400', bgColor: 'from-purple-500/20' },
                  { name: 'Smoke Detector', icon: Wind, color: 'text-orange-400', bgColor: 'from-orange-500/20' }
                ].map((device, idx) => (
                  <div
                    key={device.name}
                    className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-gradient-to-br ${device.bgColor} to-transparent rounded-lg group-hover:scale-110 transition-transform`}>
                          <device.icon className={`w-5 h-5 ${device.color}`} />
                        </div>
                        <span className="font-medium">{device.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                        <span className="text-sm text-green-400 font-bold">Online</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Stats */}
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h3 className="text-xl font-bold mb-4">System Stats</h3>
              <div className="space-y-4">
                <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Network Latency</span>
                    <span className="text-sm font-bold text-green-400">12ms</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full w-[95%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>
                </div>
                
                <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">AI Confidence</span>
                    <span className="text-sm font-bold text-blue-400">98%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-[98%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  </div>
                </div>
                
                <div className="backdrop-blur-md bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Storage Used</span>
                    <span className="text-sm font-bold text-yellow-400">64%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full w-[64%] shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Modal with Enhanced Styling */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={() => setSelectedIncident(null)}>
          <div className="backdrop-blur-2xl bg-white/10 rounded-2xl max-w-3xl w-full p-8 border border-white/20 shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Incident Details
                </h2>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getThreatColor(selectedIncident.threat_level)} ${getThreatGlow(selectedIncident.threat_level)}`}>
                  {selectedIncident.threat_level.toUpperCase()} THREAT
                </span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="backdrop-blur-md bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="font-bold mb-3 text-lg">Analysis</h3>
                <p className="text-gray-200 leading-relaxed">
                  {selectedIncident.decision?.reasoning}
                </p>
              </div>
              
              {selectedIncident.decision?.evidence && (
                <div className="backdrop-blur-md bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="font-bold mb-3 text-lg">Evidence</h3>
                  <ul className="space-y-2">
                    {selectedIncident.decision.evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-200">
                        <span className="text-cyan-400 mt-1">▸</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleCall911(selectedIncident)}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105"
                >
                  <Phone className="w-6 h-6" />
                  Call 911
                </button>
                <button
                  onClick={() => handleNotifyContact(selectedIncident)}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-105"
                >
                  <Bell className="w-6 h-6" />
                  Notify Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreatDashboard;