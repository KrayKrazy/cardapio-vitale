export const menuItems = [
  { 
    id: 1, 
    name: 'Smash Premium', 
    desc: 'Pão brioche selado na manteiga, 2 smashs 90g, duplo cheddar inglês e molho secreto.', 
    price: 32.90, 
    category: 'Hambúrgueres', 
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&w=600&q=80',
    hasBump: true
  },
  { 
    id: 2, 
    name: 'Bacon Master', 
    desc: 'Blend 180g, farofa de bacon, queijo prato derretido, cebola caramelizada.', 
    price: 38.90, 
    category: 'Hambúrgueres', 
    img: 'https://images.unsplash.com/photo-1594212202875-54d4f8fb36c0?auto=format&w=600&q=80',
    hasBump: true
  },
  { 
    id: 3, 
    name: 'Chicken Crispy', 
    desc: 'Sobrecoxa empanada super crocante, alface americana e maionese de limão siciliano.', 
    price: 29.90, 
    category: 'Hambúrgueres', 
    img: 'https://images.unsplash.com/photo-1615719417058-299f1fa023de?auto=format&w=600&q=80',
    hasBump: true
  },
  { 
    id: 4, 
    name: 'Batata Rústica Trfada', 
    desc: 'Batatas rústicas com azeite trufado e parmesão ralado.', 
    price: 22.00, 
    category: 'Acompanhamentos', 
    img: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&w=600&q=80',
    hasBump: false
  },
  { 
    id: 5, 
    name: 'Onion Rings', 
    desc: 'Anéis de cebola empanados com molho barbecue.', 
    price: 18.00, 
    category: 'Acompanhamentos', 
    img: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&w=600&q=80',
    hasBump: false
  },
  { 
    id: 6, 
    name: 'Milkshake Ninho com Nutella', 
    desc: 'Sorvete artesanal batido com leite ninho e muita nutella.', 
    price: 24.90, 
    category: 'Sobremesas', 
    img: 'https://images.unsplash.com/photo-1572490122747-3968b75bf699?auto=format&w=600&q=80',
    hasBump: false,
    isUpsell: true
  },
  { 
    id: 7, 
    name: 'Refrigerante Lata', 
    desc: 'Coca-cola, Guaraná ou Sprite 350ml.', 
    price: 7.00, 
    category: 'Bebidas', 
    img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&w=600&q=80',
    hasBump: false
  }
];

export const orderBumps = [
  { id: 101, name: 'Adicionar Bacon em Dobro', price: 6.00 },
  { id: 102, name: 'Molho Extra Cheddar', price: 4.50 },
  { id: 103, name: 'Transformar em Combo (Batata P + Refri)', price: 15.00 }
];
