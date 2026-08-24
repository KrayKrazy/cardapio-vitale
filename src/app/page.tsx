'use client';
import { useState, useMemo } from 'react';
import { menuItems, orderBumps } from './MenuData';
import { ShoppingCart, Plus, Minus, X, ChevronRight, Utensils, Star, MapPin, Truck } from 'lucide-react';

export default function Platform() {
  const [cart, setCart] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('Hambúrgueres');
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedBumps, setSelectedBumps] = useState<number[]>([]);
  const [showUpsell, setShowUpsell] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = Array.from(new Set(menuItems.map(i => i.category)));

  // Derived state
  const subtotal = cart.reduce((acc, item) => {
    const itemTotal = item.price;
    const bumpsTotal = item.bumps ? item.bumps.reduce((bAcc: number, b: any) => bAcc + b.price, 0) : 0;
    return acc + itemTotal + bumpsTotal;
  }, 0);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setSelectedBumps([]); // reset bumps
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
  };

  // Upsell Logic
  const upsellSuggestion = useMemo(() => {
    return menuItems.find(i => i.isUpsell);
  }, []);

  const handleInitiateCheckout = () => {
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
    processCheckout(); // Vai processar com o upsell j no carrinho
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

  return (
    <div className="min-h-screen pb-32 font-sans bg-[#0a0a0a]">
      {/* DELIVERY BANNER (CRO) */}
      <div className="bg-green-600 text-white text-xs font-bold text-center py-2 px-4 flex items-center justify-center gap-2">
        <Truck className="w-4 h-4" /> Entrega Grátis em toda a região hoje!
      </div>

      {/* HEADER HERO */}
      <header className="relative w-full h-56 flex flex-col justify-end p-6">
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <img src="/hero.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50 z-[-1]" />
        <div className="relative z-10">
          <div className="bg-red-600 text-white text-xs font-black px-2 py-1 inline-block rounded mb-2 uppercase tracking-wider">
            Aberto agora
          </div>
          <h1 className="text-4xl font-black text-white leading-tight">
            Sua <span className="text-yellow-400">Empresa Aqui</span>
          </h1>
          <p className="text-gray-200 text-sm mt-1 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 
            4.9 (500+ avaliações)
          </p>
        </div>
      </header>

      {/* CATEGORY NAV (STICKY) */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md py-4 border-b border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex overflow-x-auto hide-scrollbar px-4 gap-3">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat 
                ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.4)]' 
                : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN MENU */}
      <main className="max-w-2xl mx-auto px-4 pt-6">
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
          {activeCategory}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {menuItems.filter(i => i.category === activeCategory).map((item, index) => (
            <div 
              key={item.id} 
              onClick={() => handleProductClick(item)}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 flex gap-4 cursor-pointer hover:border-red-600 transition-all shadow-lg active:scale-95 group relative overflow-hidden"
            >
              {/* BEST SELLER BADGE */}
              {index === 0 && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-md">
                  Mais Vendido
                </div>
              )}
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-red-500 transition-colors pr-8">{item.name}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.desc}</p>
                </div>
                <div className="mt-4 font-black text-yellow-400 text-lg">
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </div>
              </div>
              <div className="relative">
                <img src={item.img} alt={item.name} className="w-28 h-28 object-cover rounded-2xl shadow-md border border-neutral-800" />
                <div className="absolute -bottom-3 -right-3 bg-red-600 text-white p-2 rounded-full shadow-lg group-hover:bg-red-500 transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ORDER BUMP MODAL (MOBILE OPTIMIZED) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/80 backdrop-blur-sm sm:p-4 transition-all">
          <div className="bg-neutral-900 w-full max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-10 max-h-[90vh] flex flex-col">
            <div className="relative h-48 sm:h-56 shrink-0">
              <img src={selectedProduct.img} className="w-full h-full object-cover sm:rounded-t-3xl rounded-t-3xl" alt="" />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white hover:bg-black/90 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-neutral-900 to-transparent"></div>
            </div>
            
            <div className="p-6 overflow-y-auto hide-scrollbar -mt-6 relative z-10">
              <h2 className="text-3xl font-black text-white leading-tight">{selectedProduct.name}</h2>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">{selectedProduct.desc}</p>
              
              <div className="mt-6 bg-neutral-800/50 rounded-2xl p-4 border border-yellow-500/20">
                <h3 className="font-bold text-yellow-400 flex items-center gap-2 mb-3 text-lg">
                  <Utensils className="w-5 h-5" /> Turbine seu pedido
                </h3>
                <div className="space-y-3">
                  {orderBumps.map(bump => (
                    <div key={bump.id} onClick={() => toggleBump(bump.id)} className="flex items-center justify-between p-3 bg-neutral-900 rounded-xl cursor-pointer hover:bg-neutral-950 transition border border-transparent hover:border-neutral-700 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${selectedBumps.includes(bump.id) ? 'bg-red-600 border-red-600' : 'border-neutral-600 bg-neutral-800'}`}>
                          {selectedBumps.includes(bump.id) && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                        </div>
                        <span className="text-sm font-semibold text-gray-200">{bump.name}</span>
                      </div>
                      <span className="text-yellow-400 font-bold text-sm">+ R$ {bump.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={confirmProductWithBumps}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-[0_5px_20px_rgba(220,38,38,0.4)] transition-transform active:scale-95 text-lg flex justify-between px-6 items-center"
              >
                <span>Quero esse!</span>
                <span>
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

      {/* UPSELL MODAL */}
      {showUpsell && upsellSuggestion && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 w-full max-w-sm rounded-3xl p-6 text-center shadow-[0_0_50px_rgba(220,38,38,0.2)] border border-red-900/50 animate-in zoom-in-95">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Quase lá!</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Que tal adicionar nossa sobremesa mais vendida para fechar com chave de ouro?</p>
            
            <div className="relative w-40 h-40 mx-auto mb-4">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <img src={upsellSuggestion.img} className="relative w-full h-full rounded-full object-cover shadow-2xl border-4 border-neutral-800" alt="" />
            </div>
            
            <h3 className="font-bold text-2xl text-yellow-400 leading-tight">{upsellSuggestion.name}</h3>
            <p className="text-white font-black text-xl mt-2">Por apenas R$ {upsellSuggestion.price.toFixed(2).replace('.', ',')}</p>

            <div className="mt-8 space-y-3">
              <button 
                onClick={() => acceptUpsellAndPay(upsellSuggestion)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 rounded-xl shadow-[0_5px_20px_rgba(250,204,21,0.3)] transition-transform active:scale-95 text-lg"
              >
                Sim, eu quero!
              </button>
              <button 
                onClick={declineUpsellAndPay}
                className="w-full bg-transparent text-gray-400 hover:text-white font-bold py-3 rounded-xl transition"
              >
                Não, obrigado. Ir para pagamento.
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CART (CRO OPTIMIZED) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pb-4 pt-4 px-4 sm:pb-6">
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={handleInitiateCheckout}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 text-white px-6 py-4 rounded-2xl font-black text-lg flex items-center justify-between shadow-[0_5px_25px_rgba(220,38,38,0.4)] transition-all active:scale-95"
            >
              <div className="flex items-center gap-3">
                <div className="bg-black/30 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {isLoading ? <span className="animate-spin text-xl">↻</span> : cart.length}
                </div>
                <span>{isLoading ? 'Processando...' : 'Finalizar Pedido'}</span>
              </div>
              <span className="flex items-center gap-1">
                R$ {subtotal.toFixed(2).replace('.', ',')} <ChevronRight className="w-5 h-5 opacity-70"/>
              </span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
