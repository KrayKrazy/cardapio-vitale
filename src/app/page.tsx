'use client';
import { useState, useMemo, useEffect } from 'react';
import { menuItems, orderBumps } from './MenuData';
import { ShoppingCart, Plus, Minus, X, ChevronRight, Utensils, Star, MapPin, Truck, Trash2, CheckCircle2 } from 'lucide-react';

export default function Platform() {
  const [cart, setCart] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('Hambúrgueres');
  const [mounted, setMounted] = useState(false);
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedBumps, setSelectedBumps] = useState<number[]>([]);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = Array.from(new Set(menuItems.map(i => i.category)));

  // Derived state
  const subtotal = cart.reduce((acc, item) => {
    const itemTotal = item.price;
    const bumpsTotal = item.bumps ? item.bumps.reduce((bAcc: number, b: any) => bAcc + b.price, 0) : 0;
    return acc + itemTotal + bumpsTotal;
  }, 0);

  const handleProductClick = (product: any) => {
    if (product.hasBump) {
      setSelectedProduct(product);
      setSelectedBumps([]); 
    } else {
      // Direct add to cart
      setCart([...cart, { ...product, cartId: Date.now() }]);
      showToast(`Adicionado: ${product.name}`);
    }
  };

  const showToast = (msg: string) => {
    setAddedToast(msg);
    setTimeout(() => setAddedToast(null), 2500);
  };

  const toggleBump = (bumpId: number) => {
    if (selectedBumps.includes(bumpId)) {
      setSelectedBumps(selectedBumps.filter(id => id !== bumpId));
    } else {
      setSelectedBumps([...selectedBumps, bumpId]);
    }
  };

  const confirmProductWithBumps = () => {
    const bumps = orderBumps.filter(b => selectedBumps.includes(b.id));
    setCart([...cart, { ...selectedProduct, cartId: Date.now(), bumps }]);
    setSelectedProduct(null);
    showToast(`Adicionado: ${selectedProduct.name}`);
  };

  const removeFromCart = (cartId: number) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // Upsell Logic
  const upsellSuggestion = useMemo(() => {
    return menuItems.find(i => i.isUpsell);
  }, []);

  const handleInitiateCheckout = () => {
    setShowCart(false);
    const hasUpsellInCart = cart.some(item => item.isUpsell);
    if (!hasUpsellInCart && upsellSuggestion) {
      setShowUpsell(true);
    } else {
      processCheckout();
    }
  };

  const acceptUpsellAndPay = (upsell: any) => {
    setCart(prev => [...prev, { ...upsell, cartId: Date.now() }]);
    setShowUpsell(false);
    processCheckout(); 
  };

  const declineUpsellAndPay = () => {
    setShowUpsell(false);
    processCheckout();
  };

  const processCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, total: subtotal })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-40 font-sans bg-[#0a0a0a] text-white selection:bg-red-600/30">
      {/* PREMIUM TOAST */}
      {addedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-neutral-800/90 backdrop-blur-xl border border-neutral-700/50 text-white px-6 py-3 rounded-full font-medium shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-2 animate-in slide-in-from-top-10 fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          {addedToast}
        </div>
      )}

      {/* HEADER HERO (IMMERSIVE) */}
      <header className="relative w-full h-72 sm:h-80 flex flex-col justify-end p-6 overflow-hidden">
        {/* Soft immersive gradient mask to remove harsh lines */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-10"></div>
        <img src="/hero.jpg" className="absolute inset-0 w-full h-full object-cover z-0 scale-105 animate-in zoom-in duration-1000" />
        
        <div className="relative z-20 max-w-2xl mx-auto w-full">
          <div className="bg-red-600/90 backdrop-blur text-white text-xs font-black px-3 py-1.5 inline-block rounded-lg mb-3 uppercase tracking-widest shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
            Aberto agora
          </div>
          <h1 className="text-5xl font-black text-white leading-none tracking-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Empresa</span>
          </h1>
          <p className="text-gray-300 text-sm mt-3 flex items-center gap-1.5 font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" /> 
            4.9 (500+ avaliações) <span className="mx-2 opacity-30">•</span> <Truck className="w-4 h-4 text-green-400" /> Entrega Grátis
          </p>
        </div>
      </header>

      {/* CATEGORY NAV (PREMIUM STICKY) */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-2xl py-3 border-b border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
        <div className="flex overflow-x-auto hide-scrollbar px-6 gap-3 max-w-2xl mx-auto">
          {categories.map((cat, i) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ animationDelay: \`\${i * 50}ms\` }}
              className={\`whitespace-nowrap px-6 py-3 rounded-full text-sm font-black transition-all duration-300 animate-in fade-in slide-in-from-right-8 \${
                activeCategory === cat 
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)] scale-105' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN MENU */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            {activeCategory}
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.filter(i => i.category === activeCategory).map((item, index) => (
            <div 
              key={item.id} 
              onClick={() => handleProductClick(item)}
              style={{ animationDelay: \`\${index * 75}ms\` }}
              className="bg-[#111111] border border-white/5 rounded-[2rem] p-4 flex gap-4 cursor-pointer hover:border-red-500/50 hover:bg-[#161616] transition-all duration-300 shadow-xl active:scale-[0.98] group relative animate-in fade-in zoom-in-95 fill-mode-both"
            >
              {index === 0 && (
                <div className="absolute top-0 right-8 bg-yellow-400 text-black text-[10px] font-black px-4 py-1.5 rounded-b-xl uppercase tracking-widest shadow-[0_5px_15px_rgba(250,204,21,0.4)] z-10">
                  Mais Vendido
                </div>
              )}
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-black text-lg text-white group-hover:text-red-500 transition-colors leading-tight pr-6">{item.name}</h3>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed opacity-80">{item.desc}</p>
                </div>
                <div className="mt-4 font-black text-yellow-400 text-xl tracking-tight">
                  <span className="text-sm opacity-70 mr-1">R$</span>{item.price.toFixed(2).replace('.', ',')}
                </div>
              </div>
              
              <div className="relative shrink-0">
                <img src={item.img} alt={item.name} className="w-32 h-32 object-cover rounded-[1.5rem] shadow-inner bg-neutral-800" />
                <div className="absolute -bottom-2 -left-2 bg-gradient-to-br from-red-500 to-red-700 text-white p-2.5 rounded-full shadow-[0_5px_15px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-5 h-5" strokeWidth={3} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ORDER BUMP MODAL (PREMIUM) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-md transition-all">
          <div 
            className="absolute inset-0 z-0" 
            onClick={() => setSelectedProduct(null)} 
          />
          <div className="bg-[#111] w-full max-w-md sm:rounded-[2rem] rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] flex flex-col relative z-10 border border-white/10">
            
            <div className="relative h-64 shrink-0">
              <img src={selectedProduct.img} className="w-full h-full object-cover sm:rounded-t-[2rem] rounded-t-[2rem]" alt="" />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-black/80 transition shadow-lg"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#111] to-transparent"></div>
            </div>
            
            <div className="p-6 overflow-y-auto hide-scrollbar -mt-10 relative z-10 flex-1">
              <h2 className="text-3xl font-black text-white leading-tight">{selectedProduct.name}</h2>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">{selectedProduct.desc}</p>
              
              <div className="mt-8 bg-white/5 rounded-3xl p-5 border border-yellow-500/20 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl"></div>
                <h3 className="font-black text-yellow-400 flex items-center gap-2 mb-4 text-lg">
                  <Utensils className="w-5 h-5" /> Turbine seu pedido
                </h3>
                <div className="space-y-3 relative z-10">
                  {orderBumps.map(bump => (
                    <div key={bump.id} onClick={() => toggleBump(bump.id)} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl cursor-pointer hover:bg-black/60 transition-all border border-white/5 hover:border-white/10 shadow-sm active:scale-[0.98]">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${selectedBumps.includes(bump.id) ? 'bg-red-500 border-red-500' : 'border-neutral-600'}`}>
                          {selectedBumps.includes(bump.id) && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                        </div>
                        <span className="text-sm font-bold text-gray-200">{bump.name}</span>
                      </div>
                      <span className="text-yellow-400 font-black text-sm">+ R$ {bump.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={confirmProductWithBumps}
                className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-4.5 rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.3)] transition-transform active:scale-[0.98] text-lg flex justify-between px-6 items-center border border-red-500/50"
              >
                <span>Quero esse!</span>
                <span className="bg-black/20 px-3 py-1 rounded-lg">
                  R$ {(
                    selectedProduct.price + 
                    orderBumps.filter(b => selectedBumps.includes(b.id)).reduce((a, b) => a + b.price, 0)
                  ).toFixed(2).replace('.', ',')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART REVIEW MODAL */}
      {showCart && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-md transition-all">
          <div 
            className="absolute inset-0 z-0" 
            onClick={() => setShowCart(false)} 
          />
          <div className="bg-[#111] w-full max-w-md sm:rounded-[2rem] rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] flex flex-col relative z-10 border border-white/10">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-[2rem] backdrop-blur-md">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <div className="bg-yellow-400 p-2 rounded-xl">
                  <ShoppingCart className="w-5 h-5 text-black" />
                </div>
                Seu Pedido
              </h2>
              <button onClick={() => setShowCart(false)} className="bg-black/50 p-2.5 rounded-full text-white hover:bg-black/80 transition">
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 hide-scrollbar space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-10 h-10 text-gray-600" />
                  </div>
                  <p className="text-gray-400 font-medium">Sua sacola está vazia.</p>
                  <p className="text-gray-600 text-sm mt-2">Que tal adicionar um hambúrguer?</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartId} className="flex gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 relative animate-in fade-in slide-in-from-right-4">
                    <img src={item.img} className="w-20 h-20 rounded-2xl object-cover shadow-lg" alt="" />
                    <div className="flex-1 py-1 pr-6">
                      <h4 className="text-white font-black leading-tight">{item.name}</h4>
                      {item.bumps && item.bumps.length > 0 && (
                        <div className="text-xs font-bold text-yellow-500/80 mt-1.5 flex flex-col gap-0.5">
                          {item.bumps.map((b: any, i:number) => <span key={i}>+ {b.name}</span>)}
                        </div>
                      )}
                      <div className="text-yellow-400 font-black mt-2">
                        R$ {(item.price + (item.bumps?.reduce((a:number,b:any)=>a+b.price,0) || 0)).toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-red-500 bg-black/40 p-2 rounded-full transition active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-gradient-to-t from-[#0a0a0a] to-[#111] border-t border-white/5">
                <div className="flex justify-between items-end mb-6 px-2">
                  <span className="text-gray-400 font-medium">Total a pagar</span>
                  <span className="text-3xl font-black text-white tracking-tight">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <button 
                  onClick={handleInitiateCheckout}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black py-4.5 rounded-2xl shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-2 border border-green-400/30"
                >
                  {isLoading ? 'Gerando Pagamento...' : 'Ir para o Pagamento'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* UPSELL MODAL (PREMIUM) */}
      {showUpsell && upsellSuggestion && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 transition-all">
          <div className="bg-[#111] w-full max-w-sm rounded-[2.5rem] p-8 text-center shadow-[0_0_80px_rgba(220,38,38,0.15)] border border-white/10 animate-in zoom-in-95 duration-500 relative overflow-hidden">
            
            {/* Background glowing effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-400/20 rounded-full blur-[80px] pointer-events-none"></div>

            <h2 className="text-4xl font-black text-white mb-2 tracking-tight relative z-10">Quase lá!</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed relative z-10 font-medium">Que tal adicionar nossa sobremesa mais vendida para fechar com chave de ouro?</p>
            
            <div className="relative w-48 h-48 mx-auto mb-6 z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-400 to-transparent rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <img src={upsellSuggestion.img} className="relative w-full h-full rounded-full object-cover shadow-2xl border-4 border-[#111]" alt="" />
            </div>
            
            <h3 className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 leading-tight relative z-10">{upsellSuggestion.name}</h3>
            <p className="text-white font-black text-xl mt-2 relative z-10">Por <span className="bg-yellow-400/20 px-2 py-0.5 rounded text-yellow-400">R$ {upsellSuggestion.price.toFixed(2).replace('.', ',')}</span></p>

            <div className="mt-10 space-y-3 relative z-10">
              <button 
                onClick={() => acceptUpsellAndPay(upsellSuggestion)}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4.5 rounded-2xl shadow-[0_10px_30px_rgba(250,204,21,0.3)] transition-all active:scale-[0.98] text-lg"
              >
                Sim, eu quero!
              </button>
              <button 
                onClick={declineUpsellAndPay}
                className="w-full bg-transparent text-gray-500 hover:text-white font-bold py-3 rounded-2xl transition-colors"
              >
                Não, ir para pagamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CART (PREMIUM DOCK) */}
      {cart.length > 0 && !showCart && !selectedProduct && !showUpsell && (
        <div className="fixed bottom-6 left-4 right-4 z-40 mx-auto max-w-2xl animate-in slide-in-from-bottom-24 duration-500">
          <button 
            onClick={() => setShowCart(true)}
            className="w-full bg-neutral-900/90 backdrop-blur-2xl border border-white/10 hover:bg-neutral-800/90 text-white p-2 pr-6 rounded-[2rem] font-black text-lg flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all active:scale-[0.98] group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-gradient-to-br from-red-500 to-red-700 w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shadow-inner border border-red-400/30">
                {cart.length}
              </div>
              <span className="tracking-tight text-gray-100">Ver Carrinho</span>
            </div>
            <span className="flex items-center gap-1.5 text-yellow-400 relative z-10">
              R$ {subtotal.toFixed(2).replace('.', ',')} 
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" strokeWidth={3}/>
            </span>
          </button>
        </div>
      )}

    </div>
  );
}
