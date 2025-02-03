"use client";

import { useState } from "react";
import Game from "@/components/game/Game";

export default function Home() {
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="min-h-screen min-w-screen bg-black">
      {!showGame ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
          <h1 className="text-4xl font-bold text-white mb-4">Ghost Catcher</h1>
          <p className="text-gray-300 text-center max-w-md mb-8">
            Hayaletleri yakala, bombalardan kaç ve dondurma ağlarını topla! 
            30 saniye içinde en yüksek skoru yapmaya çalış.
          </p>
          <button
            onClick={() => setShowGame(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg 
                     text-xl font-bold transition-colors"
          >
            Oyunu Başlat 🎮
          </button>
          
          <div className="mt-8 text-sm text-gray-400">
            <h2 className="font-bold mb-2">Nasıl Oynanır:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Hayaletlere tıkla/dokun (+1 puan)</li>
              <li>Bombalardan uzak dur (-10 puan)</li>
              <li>Dondurma ağlarını kullan (5 saniyelik duraklama)</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen">
          <Game />
        </div>
      )}
    </div>
  );
}