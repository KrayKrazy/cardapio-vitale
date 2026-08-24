'use client';
import { useState, useMemo } from 'react';
import { menuItems, orderBumps } from './MenuData';
import { ShoppingCart, Plus, Minus, X, ChevronRight, Utensils, Star, MapPin } from 'lucide-react';

export default function Platform() {
  const [cart, setCart] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('Hambúrgueres');
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedBumps, setSelectedBumps] = useState<number[]>([]);
  
  const [showUpsell, setShowUpsell] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  // Add standard item to cart (without modal)
  const addSimpleItem = (item: any) => {
    setCart([...cart, { ...item, cartId: Date.now(), bumps: [] }]);
  };

  // Open modal for burgers (Order Bump)
  const handleProductClick = (item: any) => {
    if (item.hasBump) {
      setSelectedProduct(item);
      setSelectedBumps([]);
    } else {
      addSimpleItem(item);
    }
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

  const removeCartItem = (cartId: number) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const itemTotal = item.price + item.bumps.reduce((bAcc: number, b: any) => bAcc + b.price, 0);
    return acc + itemTotal;
  }, 0);

  const handleInitiateCheckout = () => {
    // Show Upsell before final checkout
    const hasUpsellInCart = cart.some(item => item.isUpsell);
    if (!hasUpsellInCart) {
      setShowUpsell(true);
    } else {
      processPayment();
    }
  };

  const acceptUpsellAndPay = (upsellItem: any) => {
    addSimpleItem(upsellItem);
    setShowUpsell(false);
    // Process payment in next tick or useEffect, but for simplicity here we just close and wait for user to click pay again, or we can force it:
    setTimeout(() => processPayment(upsellItem.price), 500);
  };

  const declineUpsellAndPay = () => {
    setShowUpsell(false);
    processPayment();
  };

  const processPayment = async (additionalAmount = 0) => {
    setIsLoading(true);
    const finalTotal = subtotal + additionalAmount;
    
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: finalTotal, items: cart })
      });
      const data = await res.json();
      
      if (data.url && !data.url.includes('fallback=catch')) {
        window.location.href = data.url;
      } else {
        alert('Cakto não autorizou a transação. Verifique se o CAKTO_OFFER_ID está correto no .env.local!');
        setIsLoading(false);
      }
    } catch (e) {
      alert('Erro de conexão com servidor.');
      setIsLoading(false);
    }
  };

  const upsellSuggestion = menuItems.find(item => item.isUpsell);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32 font-sans relative">
      
      {/* HEADER PREMIUM */}
      <header className="bg-red-700 w-full pt-8 pb-12 px-4 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-0"></div><img src="/hero.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 z-[-1]" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-white text-red-700 rounded-full flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-xl mb-4 border-4 border-yellow-400">
            Sua<br/>Logo
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase drop-shadow-md">
            Sua <span className="text-yellow-400">Empresa Aqui</span>
          </h1>
          <p className="text-red-100 mt-2 text-sm max-w-xs flex items-center justify-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            4.9 (500+ avaliações)
          </p>
        </div>
      </header>

      {/* CATEGORY NAV (STICKY) */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-md py-4 border-b border-neutral-800 shadow-lg">
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
        
        <div className="grid grid-cols-1 gap-5">
          {menuItems.filter(i => i.category === activeCategory).map(item => (
            <div 
              key={item.id} 
              onClick={() => handleProductClick(item)}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex gap-4 cursor-pointer hover:border-red-600 transition-colors shadow-lg group"
            >
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-red-500 transition-colors">{item.name}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.desc}</p>
                </div>
                <div className="mt-4 font-black text-yellow-400 text-lg">
                  R$ {item.price.toFixed(2).replace('.', ',')}
                </div>
              </div>
              <div className="relative">
                <img src={item.img} alt={item.name} className="w-28 h-28 object-cover rounded-xl shadow-md" />
                <div className="absolute -bottom-3 -right-3 bg-red-600 text-white p-2 rounded-full shadow-lg">
                  <Plus className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ORDER BUMP MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95">
            <div className="relative h-48">
              <img src={selectedProduct.img} className="w-full h-full object-cover" alt="" />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-black text-white">{selectedProduct.name}</h2>
              <p className="text-gray-400 text-sm mt-2">{selectedProduct.desc}</p>
              
              <div className="mt-6 bg-neutral-800 rounded-2xl p-4 border border-yellow-500/30">
                <h3 className="font-bold text-yellow-400 flex items-center gap-2 mb-3">
                  <Utensils className="w-4 h-4" /> Turbine seu pedido
                </h3>
                <div className="space-y-3">
                  {orderBumps.map(bump => (
                    <div key={bump.id} onClick={() => toggleBump(bump.id)} className="flex items-center justify-between p-3 bg-neutral-900 rounded-xl cursor-pointer hover:bg-neutral-950 transition">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${selectedBumps.includes(bump.id) ? 'bg-red-600 border-red-600' : 'border-gray-500'}`}>
                          {selectedBumps.includes(bump.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className="text-sm font-medium text-gray-200">{bump.name}</span>
                      </div>
                      <span className="text-yellow-400 font-bold text-sm">+ R$ {bump.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={confirmProductWithBumps}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-lg transition-transform active:scale-95"
              >
                Adicionar por R$ {(
                  selectedProduct.price + 
                  orderBumps.filter(b => selectedBumps.includes(b.id)).reduce((a, b) => a + b.price, 0)
                ).toFixed(2).replace('.', ',')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPSELL MODAL */}
      {showUpsell && upsellSuggestion && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 w-full max-w-sm rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(220,38,38,0.3)] border border-red-900/50">
            <h2 className="text-2xl font-black text-white mb-2">Quase lá!</h2>
            <p className="text-gray-400 text-sm mb-6">Que tal adicionar nossa sobremesa mais vendida para fechar com chave de ouro?</p>
            
            <img src={upsellSuggestion.img} className="w-40 h-40 mx-auto rounded-full object-cover shadow-2xl mb-4 border-4 border-neutral-800" alt="" />
            <h3 className="font-bold text-xl text-yellow-400">{upsellSuggestion.name}</h3>
            <p className="text-white font-black text-2xl mt-1">Por apenas R$ {upsellSuggestion.price.toFixed(2)}</p>

            <div className="mt-8 space-y-3">
              <button 
                onClick={() => acceptUpsellAndPay(upsellSuggestion)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 rounded-xl shadow-lg transition-transform active:scale-95 text-lg"
              >
                Sim, eu quero!
              </button>
              <button 
                onClick={declineUpsellAndPay}
                className="w-full bg-transparent text-gray-400 hover:text-white font-semibold py-3 rounded-xl transition"
              >
                Não, obrigado. Ir para pagamento.
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CART */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-neutral-900 border-t border-neutral-800 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pb-safe">
          <div className="max-w-2xl mx-auto p-4">
            <button 
              onClick={handleInitiateCheckout}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 text-white px-6 py-4 rounded-2xl font-black text-lg flex items-center justify-between shadow-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-black/30 w-10 h-10 rounded-full flex items-center justify-center">
                  {isLoading ? <span className="animate-spin text-xl">⏳</span> : cart.length}
                </div>
                <span>{isLoading ? 'Processando PIX...' : 'Finalizar Pedido'}</span>
              </div>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')} <ChevronRight className="inline w-5 h-5 opacity-50"/></span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
