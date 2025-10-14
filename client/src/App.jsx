import React, { useState } from 'react';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { LandingPage } from './components/LandingPage/LandingPage';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import { ProductModal } from './components/Modal/ProductModal';
import { SearchBar } from './components/SearchBar/SearchBar';

// Datos de ejemplo
const sampleProducts = [
  {
    id: 1,
    name: 'Cartucho Toner Brother TN3609XXL',
    sku: 'TN3609XXL',
    price: 68.60,
    currency: 'USD',
    iva: '21%',
    stock: 79,
    stockStatus: 'disponible',
    brand: 'BROTHER',
    category: 'Elit',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum ...',
    fullDescription: 'TONER BROTHER TN-3609XXL\nRendimiento: 11,000\nColor: NEGRO',
    link: 'https://www.elit.com.ar/producto/19088-cartucho-toner-brother-tn3609xxl'
  },
  {
    id: 2,
    name: 'Cartucho de Tinta Brother LC105C Cyan',
    sku: 'BROL105C',
    price: 26251.02,
    currency: 'ARS',
    iva: '10.5%',
    stock: 15,
    stockStatus: 'limitado',
    brand: 'BROTHER',
    category: 'Stenfar',
    description: 'Cartucho de tinta color cyan de alta capacidad para equipos Brother Inkjet.',
    fullDescription: 'BROTHER LC105C - CARTUCHO DE TINTA CYAN\nRendimiento: 1200 páginas\nColor: CIAN\nCompatibilidad: MFC-J4510DW, MFC-J4710DW, MFC-J6920DW',
    link: 'https://www.stenfar.com.ar/producto/LC105C'
  },
  {
    id: 3,
    name: 'Epson Original Botella de Tinta Magenta L3110/L3150',
    sku: 'T544M',
    price: 9.89,
    currency: 'USD',
    iva: '21%',
    stock: 79,
    stockStatus: 'disponible',
    brand: 'EPSON',
    category: 'Grupo Nucleo',
    description: 'Botella de tinta color magenta para impresoras Epson Ecotank L3110 y L3150.',
    fullDescription: 'EPSON T544320 MAGENTA ORIGINAL\nCapacidad: 65 ml\nRendimiento: hasta 6500 páginas\nCompatibilidad: L3110, L3150, L4150, L5190\nColor: MAGENTA',
    link: 'https://www.epson.com.ar/productos/botella-tinta-t544-magenta'
  },
  {
    id: 4,
    name: 'Cartucho Toner Brother TN660',
    sku: 'TN660',
    price: 59.90,
    currency: 'USD',
    iva: '21%',
    stock: 25,
    stockStatus: 'limitado',
    brand: 'BROTHER',
    category: 'GTC Ribbon',
    description: 'Cartucho de tóner negro para impresoras Brother con alto rendimiento.',
    fullDescription: 'TONER BROTHER TN-660\nRendimiento: 2,600 páginas\nColor: NEGRO\nCompatibilidad: HL-L2300D, HL-L2320D, HL-L2380DW, MFC-L2700DW',
    link: 'https://www.gtcribbon.com/producto/toner-brother-tn660'
  },
  {
    id: 5,
    name: 'Cartucho Toner Brother TN450',
    sku: 'TN450',
    price: 54.75,
    currency: 'USD',
    iva: '21%',
    stock: 9,
    stockStatus: 'poco stock',
    brand: 'BROTHER',
    category: 'Elit',
    description: 'Cartucho de tóner negro de capacidad estándar para impresoras Brother.',
    fullDescription: 'TONER BROTHER TN-450\nRendimiento: 2,600 páginas\nColor: NEGRO\nCompatibilidad: HL-2220, HL-2270DW, MFC-7860DW, DCP-7065DN',
    link: 'https://www.elit.com.ar/producto/toner-brother-tn450'
  },
  {
    id: 6,
    name: 'Epson Botella de Tinta Negra T544120',
    sku: 'T544BK',
    price: 9.89,
    currency: 'USD',
    iva: '21%',
    stock: 120,
    stockStatus: 'disponible',
    brand: 'EPSON',
    category: 'Grupo Nucleo',
    description: 'Botella de tinta negra Epson para sistema Ecotank con alto rendimiento.',
    fullDescription: 'EPSON BOTELLA DE TINTA NEGRA T544120 ORIGINAL\nRendimiento: 7500 páginas\nColor: NEGRO\nCompatibilidad: L3110, L3150, L5190, L3210, L3250',
    link: 'https://www.epson.com.ar/productos/botella-tinta-t544-negra'
  },
  {
    id: 7,
    name: 'Cartucho de Tinta Brother LC103M Magenta',
    sku: 'LC103M',
    price: 19.90,
    currency: 'USD',
    iva: '10.5%',
    stock: 35,
    stockStatus: 'disponible',
    brand: 'BROTHER',
    category: 'Stenfar',
    description: 'Cartucho de tinta color magenta compatible con impresoras Brother Inkjet.',
    fullDescription: 'BROTHER LC103M CARTUCHO DE TINTA MAGENTA\nRendimiento: 600 páginas\nColor: MAGENTA\nCompatibilidad: MFC-J470DW, MFC-J475DW, MFC-J870DW',
    link: 'https://www.stenfar.com.ar/producto/LC103M'
  },
  {
    id: 8,
    name: 'Cartucho Toner HP 17A Negro Original',
    sku: 'CF217A',
    price: 87.99,
    currency: 'USD',
    iva: '21%',
    stock: 41,
    stockStatus: 'disponible',
    brand: 'HP',
    category: 'Elit',
    description: 'Cartucho de tóner HP 17A original negro, rendimiento estándar.',
    fullDescription: 'HP 17A CF217A ORIGINAL BLACK TONER\nRendimiento: 1600 páginas\nColor: NEGRO\nCompatibilidad: LaserJet Pro M102, M130',
    link: 'https://www.elit.com.ar/producto/19089-cartucho-toner-hp-17a-cf217a'
  },
  {
    id: 9,
    name: 'Cartucho Toner Samsung MLT-D111S',
    sku: 'MLTD111S',
    price: 72.90,
    currency: 'USD',
    iva: '21%',
    stock: 22,
    stockStatus: 'limitado',
    brand: 'SAMSUNG',
    category: 'GTC Ribbon',
    description: 'Cartucho de tóner negro original Samsung MLT-D111S.',
    fullDescription: 'TONER SAMSUNG MLT-D111S ORIGINAL\nRendimiento: 1,000 páginas\nColor: NEGRO\nCompatibilidad: Xpress M2020, M2022, M2070, M2071',
    link: 'https://www.gtcribbon.com/producto/toner-samsung-mlt-d111s'
  },
  {
    id: 10,
    name: 'Cartucho Toner Brother TN227C Cyan',
    sku: 'TN227C',
    price: 84.50,
    currency: 'USD',
    iva: '21%',
    stock: 12,
    stockStatus: 'limitado',
    brand: 'BROTHER',
    category: 'Elit',
    description: 'Cartucho de tóner color cyan de alto rendimiento para impresoras Brother láser.',
    fullDescription: 'TONER BROTHER TN-227C CYAN\nRendimiento: 2300 páginas\nColor: CIAN\nCompatibilidad: HL-L3210CW, MFC-L3710CW, MFC-L3750CDW, MFC-L3770CDW',
    link: 'https://www.elit.com.ar/producto/19090-cartucho-toner-brother-tn227c'
  },
  {
    id: 11,
    name: 'Impresora Multifunción Epson EcoTank L3250',
    sku: 'C11CJ67303',
    price: 289.00,
    currency: 'USD',
    iva: '21%',
    stock: 25,
    stockStatus: 'disponible',
    brand: 'EPSON',
    category: 'Grupo Nucleo',
    description: 'Impresora multifunción con sistema de tanque de tinta recargable y conectividad Wi-Fi.',
    fullDescription: 'EPSON ECOTANK L3250 MULTIFUNCIÓN\nTipo: Impresora - Copiadora - Escáner\nConectividad: Wi-Fi, USB\nRendimiento de impresión: hasta 7,500 páginas en negro y 6,000 en color\nCompatible con botellas de tinta Epson T544 (negra, cyan, magenta, amarilla)',
    link: 'https://www.epson.com.ar/Impresora-Multifuncion-EcoTank-L3250'
  },
  {
    id: 12,
    name: 'Notebook HP 240 G8 Intel i5 8GB 512GB SSD 14"',
    sku: 'HP240G8-I5',
    price: 749.99,
    currency: 'USD',
    iva: '21%',
    stock: 14,
    stockStatus: 'limitado',
    brand: 'HP',
    category: 'Elit',
    description: 'Notebook HP 240 G8 con procesador Intel Core i5, SSD de 512GB y pantalla de 14 pulgadas.',
    fullDescription: 'HP 240 G8 - CORE I5 1135G7\nPantalla: 14” FHD (1920x1080)\nMemoria RAM: 8 GB DDR4\nAlmacenamiento: 512 GB SSD\nSistema Operativo: Windows 11 Home\nConectividad: Wi-Fi, Bluetooth, HDMI, USB 3.0',
    link: 'https://www.elit.com.ar/producto/hp-240-g8-i5-8gb-512ssd'
  }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      // TODO: Llamar a tu API
      // const response = await fetch(`https://tu-api.com/search?q=${searchQuery}`);
      // const data = await response.json();
      // setProducts(data);
      
      setProducts(sampleProducts);
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {!showResults ? (
            <LandingPage 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />
          ) : (
            <div>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Todos tus proveedores, una sola búsqueda
                </h2>
                <div className="relative max-w-2xl mx-auto">
                  <SearchBar 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={handleSearch}
                    variant="small"
                  />
                </div>
              </div>

              <ProductGrid 
                products={products}
                onProductClick={setSelectedProduct}
              />
            </div>
          )}
        </div>
      </main>

      <ProductModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Footer />
    </div>
  );
}

export default App;