import React, { useState, useEffect } from 'react';

const AiSupplierMatcher = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [matchedSuppliers, setMatchedSuppliers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const requestDetails = {
    productType: 'Steel Beams',
    quantity: 50,
    specifications: 'Grade A steel, 6m length, galvanized finish',
    budget: 8000,
    deadline: '2024-01-25',
    location: 'Tashkent'
  };

  const aiSuggestions = [
    {
      id: 'SUP-AI-001',
      name: 'MetallTech Solutions',
      matchScore: 95,
      reasons: [
        'Mahsulot ixtisosligi mos keladi',
        'Yuqori reyting (4.8/5)',
        'Tez javob beradi (2 soat)',
        'Bu hududda yetkazib berish'
      ],
      price: 7250,
      deliveryTime: '5 days',
      rating: 4.8,
      verified: true
    },
    {
      id: 'SUP-AI-002',
      name: 'Premium Steel Corp.',
      matchScore: 92,
      reasons: [
        'Eng yuqori sifat standartlari',
        'Eng tez yetkazib berish',
        'Keng tajriba',
        'Kafolatli xizmat'
      ],
      price: 7000,
      deliveryTime: '4 days',
      rating: 4.9,
      verified: true
    }
  ];

  const handleStartMatching = () => {
    setIsMatching(true);
    setMatchingProgress(0);
    setShowResults(false);

    const interval = setInterval(() => {
      setMatchingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsMatching(false);
          setMatchedSuppliers(aiSuggestions);
          setShowResults(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Supplier Matcher</h1>
          
          {!isMatching && !showResults && (
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-purple-600 text-4xl">
                  psychology
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Supplier Matching Boshlash
              </h3>
              <p className="text-gray-600 mb-6">
                Sun'iy intellekt sizning talablaringiz asosida eng mos supplierlarni topadi
              </p>
              
              <button
                onClick={handleStartMatching}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
              >
                <span className="material-symbols-outlined mr-2">psychology</span>
                AI Matching Boshlash
              </button>
            </div>
          )}

          {isMatching && (
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-purple-600 text-4xl animate-spin">
                  psychology
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Supplierlarni Qidirmoqda...
              </h3>
              <p className="text-gray-600 mb-6">
                Sun'iy intellekt sizning talablaringiz bo'yicha eng mos supplierlarni topmoqda
              </p>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${matchingProgress}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-500">
                {Math.round(matchingProgress)}% tugallandi
              </p>
            </div>
          )}

          {showResults && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-medium">AI Qidiruv Tugallandi!</h3>
                <p className="text-green-700 text-sm mt-1">
                  {matchedSuppliers.length} ta mos supplier topildi.
                </p>
              </div>

              {matchedSuppliers.map((supplier, index) => (
                <div
                  key={supplier.id}
                  className="bg-white rounded-lg shadow-sm border-2 border-purple-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-lg">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{supplier.name}</h3>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          AI Match: {supplier.matchScore}%
                        </span>
                      </div>
                    </div>
                    
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <span className="material-symbols-outlined mr-2 text-sm">check</span>
                      Tanlash
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Asosiy Ma'lumotlar</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Narx:</span>
                          <span className="font-medium text-green-600">${supplier.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Yetkazib berish:</span>
                          <span className="font-medium">{supplier.deliveryTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reyting:</span>
                          <span className="font-medium">{supplier.rating}/5</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">AI Tavsiya Sabablari</h4>
                      <ul className="space-y-1 text-sm">
                        {supplier.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="material-symbols-outlined text-green-500 mr-2 text-sm mt-0.5">
                              check
                            </span>
                            <span className="text-gray-700">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Moslik Ko'rsatkichi</h4>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div 
                          className="bg-purple-600 h-3 rounded-full" 
                          style={{ width: `${supplier.matchScore}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {supplier.matchScore}% moslik
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiSupplierMatcher;