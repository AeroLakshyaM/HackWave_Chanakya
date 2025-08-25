import React, { useState, useEffect, useRef } from "react";
import { User, Briefcase, FileText, CreditCard, Bell, CheckCircle, Download, ExternalLink, Lightbulb, Loader2 } from "lucide-react";
// Removed the static import for recharts as it was causing an error. It's now loaded dynamically.

// Helper to combine class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ✅ Floating 3D Shapes Background Component
function FloatingShapes() {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        let cleanup = () => {};
        let animationFrameId;

        const script = document.createElement('script');
        script.src = 'https://cdn.skypack.dev/three@0.132.2';
        script.async = true;
        
        script.onload = () => {
            const THREE = window.THREE;
            if (!THREE) {
                console.error("Three.js failed to load.");
                return;
            }

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            currentMount.appendChild(renderer.domElement);

            const shapes = [];
            const geometry = new THREE.IcosahedronGeometry(0.5, 0);
            
            for (let i = 0; i < 20; i++) {
                const material = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    metalness: 0.1,
                    roughness: 0.3,
                    transparent: true,
                    opacity: 0.3
                });
                const shape = new THREE.Mesh(geometry, material);
                shape.position.set(
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15
                );
                shape.rotation.set(Math.random(), Math.random(), Math.random());
                shapes.push(shape);
                scene.add(shape);
            }

            const light = new THREE.DirectionalLight(0x0055ff, 1);
            light.position.set(-1, 1, 1);
            scene.add(light);
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);

            const handleResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };
            window.addEventListener('resize', handleResize);

            const animate = () => {
                animationFrameId = requestAnimationFrame(animate);
                shapes.forEach((shape, index) => {
                    shape.rotation.x += 0.001 * (index % 3 + 1);
                    shape.rotation.y += 0.001 * (index % 2 + 1);
                    shape.position.y += 0.001 * (index % 4 + 1);
                    if (shape.position.y > 8) {
                        shape.position.y = -8;
                    }
                });
                renderer.render(scene, camera);
            };
            animate();

            cleanup = () => {
                window.removeEventListener('resize', handleResize);
                cancelAnimationFrame(animationFrameId);
                if (currentMount && renderer.domElement.parentNode === currentMount) {
                    currentMount.removeChild(renderer.domElement);
                }
                if (script.parentNode) {
                    document.body.removeChild(script);
                }
            };
        };

        document.body.appendChild(script);

        return () => {
            cleanup();
        };
    }, []);

    return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}


// ✅ Avatar component (with subscription ring)
function Avatar({ src, alt, fallback, className, isSubscribed = false }) {
  return (
    <div className={cn("relative rounded-full", className)}>
      <div className={cn(
          "relative rounded-full w-full h-full",
          isSubscribed && "p-1 bg-gradient-to-tr from-blue-500 to-blue-400"
      )}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover rounded-full border-2 border-white/50" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 rounded-full border-2 border-white/50">
            {fallback}
          </div>
        )}
      </div>
      {isSubscribed && <span className="absolute bottom-1 right-1 block h-4 w-4 rounded-full bg-green-400 border-2 border-white" />}
    </div>
  );
}

// ✅ Button component (themed)
function Button({ children, className = "", variant = "solid", size = "md", isLoading = false, isSuccess = false, ...props }) {
  const base = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed";
  const variants = {
    solid: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/40",
    ghost: "bg-transparent hover:bg-white/20 text-gray-800",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={isLoading || isSuccess} {...props}>
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {isSuccess && <CheckCircle className="w-5 h-5 mr-2" />}
      {isSuccess ? "Saved!" : children}
    </button>
  );
}

// ✅ Card components (with Glassmorphism)
function Card({ children, className }) {
  return <div className={cn("rounded-2xl border border-white/20 bg-white/30 backdrop-blur-2xl shadow-2xl shadow-blue-500/10", className)}>{children}</div>;
}
function CardContent({ children, className }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

// ✅ Input + Label components (themed)
function Input({ className, ...props }) {
  return (
    <input
      className={cn("w-full rounded-md border border-white/30 bg-white/50 px-3 py-2 text-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400", className)}
      {...props}
    />
  );
}
function Label({ htmlFor, children, className }) {
  return (
    <label htmlFor={htmlFor} className={cn("block text-sm font-medium text-gray-800 mb-1.5", className)}>
      {children}
    </label>
  );
}

// ✅ Tabs components (with INNOVATIVE sliding animation)
function Tabs({ defaultValue, children, className }) {
  const [active, setActive] = useState(defaultValue);
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    const activeTabNode = tabsRef.current?.querySelector(`[data-value="${active}"]`);
    if (activeTabNode) {
      setIndicatorStyle({
        left: activeTabNode.offsetLeft,
        width: activeTabNode.offsetWidth,
      });
    }
  }, [active]);

  const tabs = React.Children.toArray(children).filter((child) => child.type === TabsList);
  const content = React.Children.toArray(children).filter((child) => child.type === TabsContent);

  return (
    <div className={className}>
      {tabs.map((tab, i) => React.cloneElement(tab, { active, setActive, key: i, ref: tabsRef, indicatorStyle }))}
      {content.map((c, i) =>
        active === c.props.value ? React.cloneElement(c, { key: `${c.props.value}-${i}` }) : null
      )}
    </div>
  );
}
const TabsList = React.forwardRef(({ children, className, active, setActive, indicatorStyle }, ref) => {
  return (
    <div ref={ref} className={cn("relative flex gap-4 border-b border-white/20", className)}>
      {React.Children.map(children, (child) => React.cloneElement(child, { active, setActive }))}
      <div className="absolute bottom-0 h-0.5 bg-blue-500 rounded-t-full transition-all duration-300 ease-out" style={indicatorStyle}></div>
    </div>
  );
});
function TabsTrigger({ value, children, active, setActive }) {
  const isActive = active === value;
  return (
    <button
      data-value={value}
      onClick={() => setActive(value)}
      className={cn(
        "px-4 py-2 text-sm font-semibold relative transition-colors duration-300 z-10",
        isActive ? "text-blue-600" : "text-gray-800 hover:text-blue-600"
      )}
    >
      {children}
    </button>
  );
}
function TabsContent({ children }) {
  return <div className="py-6 motion-safe:animate-fade-in">{children}</div>;
}

// ... (Other components remain the same)
function AboutProductTab() {
    const productInfo = { "Primary Product": "Subscription-based project management software.", "Primary Customers": "Mid-sized tech companies, marketing agencies.", "Current Goal": "Acquiring new users", "Biggest Challenge": "High user churn after the first month." };
    return (<div className="space-y-6">{Object.entries(productInfo).map(([key, value]) => (<div key={key}><h3 className="text-sm font-medium text-gray-700">{key}</h3><p className="text-base text-black mt-1">{value}</p></div>))}</div>);
}
function ProfileRecommendationsTab() {
    const [recommendations, setRecommendations] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => { 
        setIsLoading(true); 
        const timer = setTimeout(() => { 
            setRecommendations([
                { 
                    text: "Your 'Primary Customers' description is broad. Consider narrowing it to a specific niche like 'B2B SaaS startups' for more targeted strategies.", 
                    completed: false 
                }, 
                { 
                    text: "You've mentioned 'high user churn'. Let's set up a new goal to create an onboarding email sequence to combat this.", 
                    completed: false 
                }, 
                { 
                    text: "Connect your Google Analytics to provide Chanakya with real-time traffic data for better marketing insights.", 
                    completed: false 
                }
            ]); 
            setIsLoading(false); 
        }, 1500); 
        return () => clearTimeout(timer); 
    }, []);
    
    if (isLoading) { 
        return (
            <div className="flex flex-col items-center justify-center text-center py-8">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-3" />
                <h4 className="text-sm font-semibold text-gray-800 mb-1">Analyzing profile...</h4>
                <p className="text-xs text-gray-600">Generating AI insights</p>
            </div>
        ); 
    }
    
    return (
        <div className="space-y-3">
            <p className="text-xs text-gray-600 text-center mb-3">Personalized recommendations from Chanakya</p>
            <div className="space-y-2">
                {recommendations.map((rec, i) => (
                    <div 
                        key={i} 
                        className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 motion-safe:animate-fade-in-up" 
                        style={{ animationDelay: `${i * 150}ms` }}
                    >
                        <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-black leading-relaxed">{rec.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
function AccountSettingsTab() {
    const [isSaving, setIsSaving] = useState(false); 
    const [isSuccess, setIsSuccess] = useState(false);
    
    const handleSave = () => { 
        setIsSaving(true); 
        setIsSuccess(false); 
        setTimeout(() => { 
            setIsSaving(false); 
            setIsSuccess(true); 
            setTimeout(() => setIsSuccess(false), 2000); 
        }, 1500); 
    };
    
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Nathaniel" />
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Poole" />
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue="nathaniel.poole@microsoft.com" />
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 800-000-0000" />
                </div>
            </div>
            
            {/* Social Links Section */}
            <div className="mt-8 pt-6 border-t border-white/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="linkedin">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                LinkedIn Profile
                            </div>
                        </Label>
                        <Input 
                            id="linkedin" 
                            placeholder="https://linkedin.com/in/yourprofile" 
                            defaultValue="https://linkedin.com/in/nathaniel-poole"
                        />
                    </div>
                    <div>
                        <Label htmlFor="website">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                Website
                            </div>
                        </Label>
                        <Input 
                            id="website" 
                            placeholder="https://yourwebsite.com" 
                            defaultValue="https://nathanielpoole.com"
                        />
                    </div>
                </div>
            </div>
            
            <div className="pt-8 text-right">
                <Button onClick={handleSave} isLoading={isSaving} isSuccess={isSuccess}>
                    Update Profile
                </Button>
            </div>
        </>
    );
}

// ✅ Main Component
export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans relative overflow-x-hidden">
      <FloatingShapes />
      
      {/* Enhanced background with glassmorphism layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-indigo-100/20 to-purple-100/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      
      <div className="h-40"></div> {/* Spacer for header area */}

      <div className={cn(
          "relative -mt-32 mx-auto max-w-6xl px-4 sm:px-6 transition-all duration-700 ease-out pb-12",
          loading ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
      )}>
        <Card className="relative z-10">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-96 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-white/20">
                <div className="text-center mb-8">
                  <Avatar
                    src="https://placehold.co/128x128/E2E8F0/4A5568?text=NP"
                    alt="Nathaniel Poole"
                    fallback="NP"
                    className="w-28 h-28 mx-auto mb-4"
                    isSubscribed={true}
                  />
                  <h2 className="text-xl font-bold text-black mb-1">Nathaniel Poole</h2>
                  <p className="text-sm text-gray-800">Microsoft Inc.</p>
                </div>
                
                {/* AI Recommendations moved to sidebar */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-black mb-4 text-center">AI Insights</h3>
                  <ProfileRecommendationsTab />
                </div>
              </div>

              <div className="flex-1 p-6 sm:p-8">
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8 gap-8">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="company">Product</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="notifications">Alerts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="account"><AccountSettingsTab /></TabsContent>
                  <TabsContent value="company"><AboutProductTab /></TabsContent>
                  <TabsContent value="documents">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-white/30 rounded-lg hover:bg-white/20 transition-colors">
                            <div className="flex items-center gap-4">
                                <FileText className="w-6 h-6 text-blue-500"/>
                                <div>
                                    <h4 className="font-semibold text-black">Master_Service_Agreement.pdf</h4>
                                    <p className="text-sm text-gray-700">Updated 2 months ago</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm"><Download className="w-4 h-4 mr-2"/> Download</Button>
                        </div>
                         <div className="flex items-center justify-between p-4 border border-white/30 rounded-lg hover:bg-white/20 transition-colors">
                            <div className="flex items-center gap-4">
                                <FileText className="w-6 h-6 text-blue-500"/>
                                <div>
                                    <h4 className="font-semibold text-black">Project_Chanakya_Brief.docx</h4>
                                    <p className="text-sm text-gray-700">Updated 1 week ago</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm"><Download className="w-4 h-4 mr-2"/> Download</Button>
                        </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="billing">
                    <div className="p-6 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex justify-between items-center"><h4 className="font-semibold text-black">Enterprise Plan</h4><p className="text-2xl font-bold text-black">$499<span className="text-sm font-medium text-gray-700">/mo</span></p></div>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/20"><div className="flex items-center gap-3"><CreditCard className="w-5 h-5 text-gray-700" /><p className="text-sm text-black">Ending in 1234</p></div><Button variant="ghost" size="sm">Update Payment</Button></div>
                    </div>
                  </TabsContent>
                  <TabsContent value="notifications">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-white/30 rounded-lg"><div><h4 className="font-semibold text-black">Weekly Summary</h4><p className="text-sm text-gray-700">Get a report of your product's progress.</p></div><input type="checkbox" className="toggle-checkbox" defaultChecked /></div>
                        <div className="flex items-center justify-between p-4 border border-white/30 rounded-lg"><div><h4 className="font-semibold text-black">Security Alerts</h4><p className="text-sm text-gray-700">Notify me about important account activity.</p></div><input type="checkbox" className="toggle-checkbox" defaultChecked /></div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

       

      </div>
    </div>
  );
}

// You will need to add these new animations to your global CSS file (e.g., index.css)
/*
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.4s ease-out forwards; }

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; opacity: 0; }

.toggle-checkbox {
  appearance: none;
  width: 3.5rem;
  height: 1.75rem;
  border-radius: 9999px;
  background-color: #e5e7eb;
  position: relative;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
}
.toggle-checkbox:checked { background-color: #2563eb; }
.toggle-checkbox::before {
  content: '';
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background-color: white;
  top: 0.25rem;
  left: 0.25rem;
  transition: transform 0.2s ease-in-out;
}
.toggle-checkbox:checked::before { transform: translateX(1.75rem); }
*/
