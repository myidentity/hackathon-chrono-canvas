/**
 * TravelStickers component for providing a rich collection of travel-themed stickers
 * Includes comprehensive categories covering all aspects of travel experiences
 */
import React from 'react';
import './TravelStickers.css';

// Sticker data structure with categories and items
const travelStickers = {
  happiness: [
    { id: 'happy-sun', emoji: '☀️', name: 'Happy Sun', color: '#FFD700' },
    { id: 'beach', emoji: '🏖️', name: 'Beach Scene', color: '#87CEEB' },
    { id: 'hammock', emoji: '🏝️', name: 'Relaxing Hammock', color: '#3CB371' },
    { id: 'cocktail', emoji: '🍹', name: 'Tropical Drink', color: '#FF6347' },
    { id: 'ice-cream', emoji: '🍦', name: 'Ice Cream', color: '#FFDAB9' },
    { id: 'smile', emoji: '😊', name: 'Happy Face', color: '#FFFF00' },
  ],
  adventure: [
    { id: 'mountain', emoji: '🏔️', name: 'Mountain', color: '#A9A9A9' },
    { id: 'hiking', emoji: '🥾', name: 'Hiking Boot', color: '#8B4513' },
    { id: 'compass', emoji: '🧭', name: 'Compass', color: '#CD853F' },
    { id: 'binoculars', emoji: '🔭', name: 'Binoculars', color: '#2F4F4F' },
    { id: 'tent', emoji: '⛺', name: 'Camping Tent', color: '#228B22' },
    { id: 'backpack', emoji: '🎒', name: 'Backpack', color: '#FF4500' },
    { id: 'map', emoji: '🗺️', name: 'World Map', color: '#DEB887' },
  ],
  challenge: [
    { id: 'mountain-peak', emoji: '🏔️', name: 'Mountain Peak', color: '#708090' },
    { id: 'storm', emoji: '⛈️', name: 'Storm', color: '#4682B4' },
    { id: 'rough-sea', emoji: '🌊', name: 'Rough Sea', color: '#1E90FF' },
    { id: 'desert', emoji: '🏜️', name: 'Desert', color: '#F4A460' },
    { id: 'volcano', emoji: '🌋', name: 'Volcano', color: '#B22222' },
    { id: 'snowflake', emoji: '❄️', name: 'Cold Weather', color: '#B0E0E6' },
  ],
  discovery: [
    { id: 'magnifying-glass', emoji: '🔍', name: 'Magnifying Glass', color: '#9370DB' },
    { id: 'treasure-map', emoji: '🗺️', name: 'Treasure Map', color: '#D2B48C' },
    { id: 'question-mark', emoji: '❓', name: 'Mystery', color: '#9932CC' },
    { id: 'lightbulb', emoji: '💡', name: 'Idea', color: '#FFD700' },
    { id: 'compass-rose', emoji: '🧭', name: 'Compass Rose', color: '#B8860B' },
    { id: 'telescope', emoji: '🔭', name: 'Telescope', color: '#483D8B' },
  ],
  wonder: [
    { id: 'stars', emoji: '✨', name: 'Starry Sky', color: '#191970' },
    { id: 'rainbow', emoji: '🌈', name: 'Rainbow', color: '#FF69B4' },
    { id: 'northern-lights', emoji: '🌌', name: 'Northern Lights', color: '#7B68EE' },
    { id: 'ancient-ruins', emoji: '🏛️', name: 'Ancient Ruins', color: '#BDB76B' },
    { id: 'waterfall', emoji: '🏞️', name: 'Waterfall', color: '#40E0D0' },
    { id: 'grand-canyon', emoji: '🏜️', name: 'Grand Canyon', color: '#CD5C5C' },
  ],
  excitement: [
    { id: 'roller-coaster', emoji: '🎢', name: 'Roller Coaster', color: '#FF1493' },
    { id: 'parachute', emoji: '🪂', name: 'Parachute', color: '#00BFFF' },
    { id: 'surfing', emoji: '🏄', name: 'Surfing', color: '#00CED1' },
    { id: 'skiing', emoji: '⛷️', name: 'Skiing', color: '#F0FFFF' },
    { id: 'hot-air-balloon', emoji: '🎈', name: 'Hot Air Balloon', color: '#FF6347' },
    { id: 'fireworks', emoji: '🎆', name: 'Fireworks', color: '#9400D3' },
  ],
  relaxation: [
    { id: 'spa', emoji: '💆', name: 'Spa', color: '#E6E6FA' },
    { id: 'sunset', emoji: '🌅', name: 'Sunset', color: '#FFA07A' },
    { id: 'garden', emoji: '🌷', name: 'Garden', color: '#98FB98' },
    { id: 'book', emoji: '📚', name: 'Reading', color: '#DEB887' },
    { id: 'tea', emoji: '🍵', name: 'Tea', color: '#D2B48C' },
    { id: 'yoga', emoji: '🧘', name: 'Yoga', color: '#DDA0DD' },
  ],
  cultural: [
    { id: 'cuisine', emoji: '🍲', name: 'Local Cuisine', color: '#CD853F' },
    { id: 'clothing', emoji: '👘', name: 'Traditional Clothing', color: '#FF00FF' },
    { id: 'festival', emoji: '🎭', name: 'Festival', color: '#FF4500' },
    { id: 'monument', emoji: '🗿', name: 'Monument', color: '#A9A9A9' },
    { id: 'music', emoji: '🎵', name: 'Local Music', color: '#9370DB' },
    { id: 'art', emoji: '🎨', name: 'Local Art', color: '#DA70D6' },
  ],
  transportation: [
    { id: 'airplane', emoji: '✈️', name: 'Airplane', color: '#1E90FF' },
    { id: 'train', emoji: '🚄', name: 'Train', color: '#B22222' },
    { id: 'ship', emoji: '🚢', name: 'Cruise Ship', color: '#4682B4' },
    { id: 'car', emoji: '🚗', name: 'Road Trip', color: '#32CD32' },
    { id: 'bicycle', emoji: '🚲', name: 'Bicycle', color: '#FF8C00' },
    { id: 'bus', emoji: '🚌', name: 'Tour Bus', color: '#8A2BE2' },
    { id: 'metro', emoji: '🚇', name: 'Metro', color: '#4169E1' },
    { id: 'ferry', emoji: '⛴️', name: 'Ferry', color: '#20B2AA' },
    { id: 'sailboat', emoji: '⛵', name: 'Sailboat', color: '#4682B4' },
    { id: 'taxi', emoji: '🚕', name: 'Taxi', color: '#FFD700' },
  ],
  landmarks: [
    { id: 'eiffel-tower', emoji: '🗼', name: 'Eiffel Tower', color: '#C0C0C0' },
    { id: 'statue-liberty', emoji: '🗽', name: 'Statue of Liberty', color: '#2E8B57' },
    { id: 'taj-mahal', emoji: '🕌', name: 'Taj Mahal', color: '#F5F5F5' },
    { id: 'pyramids', emoji: '🏛️', name: 'Pyramids', color: '#D2B48C' },
    { id: 'great-wall', emoji: '🧱', name: 'Great Wall', color: '#A0522D' },
    { id: 'colosseum', emoji: '🏟️', name: 'Colosseum', color: '#DEB887' },
  ],
  love: [
    { id: 'heart', emoji: '❤️', name: 'Heart', color: '#FF0000' },
    { id: 'couple', emoji: '👫', name: 'Couple', color: '#FF69B4' },
    { id: 'rose', emoji: '🌹', name: 'Rose', color: '#DC143C' },
    { id: 'ring', emoji: '💍', name: 'Ring', color: '#FFD700' },
    { id: 'kiss', emoji: '💋', name: 'Kiss', color: '#FF1493' },
    { id: 'love-letter', emoji: '💌', name: 'Love Letter', color: '#FFC0CB' },
  ],
  romantic: [
    { id: 'honeymoon', emoji: '🏝️', name: 'Honeymoon', color: '#FF69B4' },
    { id: 'romantic-dinner', emoji: '🍷', name: 'Romantic Dinner', color: '#8B0000' },
    { id: 'sunset-walk', emoji: '🌅', name: 'Sunset Walk', color: '#FF4500' },
    { id: 'gondola', emoji: '🚣', name: 'Gondola Ride', color: '#000080' },
    { id: 'proposal', emoji: '💍', name: 'Proposal', color: '#FF1493' },
    { id: 'anniversary', emoji: '🎉', name: 'Anniversary', color: '#FF00FF' },
  ],
  food: [
    { id: 'pizza', emoji: '🍕', name: 'Pizza', color: '#FF6347' },
    { id: 'sushi', emoji: '🍣', name: 'Sushi', color: '#F08080' },
    { id: 'taco', emoji: '🌮', name: 'Taco', color: '#FFD700' },
    { id: 'pasta', emoji: '🍝', name: 'Pasta', color: '#FFA07A' },
    { id: 'burger', emoji: '🍔', name: 'Burger', color: '#8B4513' },
    { id: 'curry', emoji: '🍛', name: 'Curry', color: '#CD853F' },
    { id: 'wine', emoji: '🍷', name: 'Wine', color: '#800000' },
    { id: 'coffee', emoji: '☕', name: 'Coffee', color: '#A0522D' },
    { id: 'street-food', emoji: '🥘', name: 'Street Food', color: '#FF8C00' },
    { id: 'dessert', emoji: '🍰', name: 'Dessert', color: '#FFB6C1' },
  ],
  religion: [
    { id: 'church', emoji: '⛪', name: 'Church', color: '#708090' },
    { id: 'mosque', emoji: '🕌', name: 'Mosque', color: '#F5F5F5' },
    { id: 'temple', emoji: '🛕', name: 'Temple', color: '#CD853F' },
    { id: 'synagogue', emoji: '🕍', name: 'Synagogue', color: '#4682B4' },
    { id: 'prayer', emoji: '🙏', name: 'Prayer', color: '#DEB887' },
    { id: 'meditation', emoji: '🧘', name: 'Meditation', color: '#9370DB' },
    { id: 'shrine', emoji: '⛩️', name: 'Shrine', color: '#FF0000' },
    { id: 'pilgrimage', emoji: '🚶', name: 'Pilgrimage', color: '#8B4513' },
    { id: 'holy-book', emoji: '📖', name: 'Holy Book', color: '#4B0082' },
  ],
  family: [
    { id: 'family', emoji: '👨‍👩‍👧‍👦', name: 'Family', color: '#FF69B4' },
    { id: 'parents', emoji: '👫', name: 'Parents', color: '#6A5ACD' },
    { id: 'children', emoji: '👧👦', name: 'Children', color: '#FF6347' },
    { id: 'grandparents', emoji: '👴👵', name: 'Grandparents', color: '#708090' },
    { id: 'baby', emoji: '👶', name: 'Baby', color: '#FFC0CB' },
    { id: 'family-photo', emoji: '📸', name: 'Family Photo', color: '#4682B4' },
    { id: 'family-meal', emoji: '🍽️', name: 'Family Meal', color: '#CD853F' },
    { id: 'family-home', emoji: '🏡', name: 'Family Home', color: '#8FBC8F' },
    { id: 'family-vacation', emoji: '🏖️', name: 'Family Vacation', color: '#00BFFF' },
  ],
  solo: [
    { id: 'solo-traveler', emoji: '🧳', name: 'Solo Traveler', color: '#4682B4' },
    { id: 'selfie', emoji: '🤳', name: 'Selfie', color: '#FF69B4' },
    { id: 'journal', emoji: '📓', name: 'Travel Journal', color: '#8B4513' },
    { id: 'hostel', emoji: '🛏️', name: 'Hostel', color: '#A52A2A' },
    { id: 'backpacker', emoji: '🎒', name: 'Backpacker', color: '#006400' },
    { id: 'solo-adventure', emoji: '🧗', name: 'Solo Adventure', color: '#2F4F4F' },
    { id: 'self-discovery', emoji: '🔍', name: 'Self Discovery', color: '#9932CC' },
    { id: 'freedom', emoji: '🕊️', name: 'Freedom', color: '#1E90FF' },
    { id: 'digital-nomad', emoji: '💻', name: 'Digital Nomad', color: '#4B0082' },
    { id: 'solo-dining', emoji: '🍽️', name: 'Solo Dining', color: '#8B0000' },
  ],
  ages: [
    { id: 'baby', emoji: '👶', name: 'Baby', color: '#FFC0CB' },
    { id: 'child', emoji: '👧', name: 'Child', color: '#FF69B4' },
    { id: 'teenager', emoji: '👱', name: 'Teenager', color: '#FF6347' },
    { id: 'young-adult', emoji: '👩', name: 'Young Adult', color: '#FF4500' },
    { id: 'adult', emoji: '👨', name: 'Adult', color: '#8B4513' },
    { id: 'senior', emoji: '👵', name: 'Senior', color: '#708090' },
    { id: 'multi-gen', emoji: '👪', name: 'Multi-generational', color: '#9370DB' },
  ],
  diversity: [
    { id: 'diverse-group', emoji: '👥', name: 'Diverse Group', color: '#4682B4' },
    { id: 'male', emoji: '👨', name: 'Male', color: '#1E90FF' },
    { id: 'female', emoji: '👩', name: 'Female', color: '#FF69B4' },
    { id: 'diverse-family', emoji: '👨‍👩‍👧‍👦', name: 'Diverse Family', color: '#FF8C00' },
    { id: 'cultural-exchange', emoji: '🤝', name: 'Cultural Exchange', color: '#32CD32' },
    { id: 'global-community', emoji: '🌍', name: 'Global Community', color: '#4169E1' },
  ],
  funny: [
    { id: 'laugh', emoji: '😂', name: 'Laughing', color: '#FFFF00' },
    { id: 'joke', emoji: '🤣', name: 'Joke', color: '#FFA500' },
    { id: 'silly-face', emoji: '🤪', name: 'Silly Face', color: '#FF69B4' },
    { id: 'prank', emoji: '🎭', name: 'Prank', color: '#9400D3' },
    { id: 'funny-photo', emoji: '📸', name: 'Funny Photo', color: '#FF6347' },
    { id: 'comedy', emoji: '🎭', name: 'Comedy', color: '#FF4500' },
  ],
  equipment: [
    { id: 'camera', emoji: '📷', name: 'Camera', color: '#000000' },
    { id: 'video-camera', emoji: '📹', name: 'Video Camera', color: '#696969' },
    { id: 'suitcase', emoji: '🧳', name: 'Suitcase', color: '#8B4513' },
    { id: 'luggage', emoji: '🧳', name: 'Luggage', color: '#A52A2A' },
    { id: 'stroller', emoji: '👶', name: 'Stroller', color: '#4682B4' },
    { id: 'wheelchair', emoji: '♿', name: 'Wheelchair', color: '#1E90FF' },
    { id: 'binoculars', emoji: '🔭', name: 'Binoculars', color: '#2F4F4F' },
    { id: 'sunglasses', emoji: '🕶️', name: 'Sunglasses', color: '#000000' },
    { id: 'hat', emoji: '👒', name: 'Hat', color: '#8B4513' },
    { id: 'sunscreen', emoji: '🧴', name: 'Sunscreen', color: '#FFFF00' },
  ],
  environments: [
    { id: 'village', emoji: '🏘️', name: 'Village', color: '#CD853F' },
    { id: 'snow', emoji: '❄️', name: 'Snow', color: '#F0FFFF' },
    { id: 'mountains', emoji: '⛰️', name: 'Mountains', color: '#696969' },
    { id: 'river', emoji: '🏞️', name: 'River', color: '#1E90FF' },
    { id: 'forest', emoji: '🌲', name: 'Forest', color: '#006400' },
    { id: 'desert', emoji: '🏜️', name: 'Desert', color: '#F4A460' },
    { id: 'beach', emoji: '🏖️', name: 'Beach', color: '#FFD700' },
    { id: 'island', emoji: '🏝️', name: 'Island', color: '#20B2AA' },
    { id: 'city', emoji: '🏙️', name: 'City', color: '#4682B4' },
    { id: 'countryside', emoji: '🌄', name: 'Countryside', color: '#32CD32' },
  ],
  nature: [
    { id: 'sunrise', emoji: '🌅', name: 'Sunrise', color: '#FF4500' },
    { id: 'sunset', emoji: '🌇', name: 'Sunset', color: '#FF8C00' },
    { id: 'landscape', emoji: '🏞️', name: 'Landscape', color: '#228B22' },
    { id: 'wildlife', emoji: '🦁', name: 'Wildlife', color: '#CD853F' },
    { id: 'flowers', emoji: '🌸', name: 'Flowers', color: '#FF69B4' },
    { id: 'ocean', emoji: '🌊', name: 'Ocean', color: '#1E90FF' },
    { id: 'lake', emoji: '🏞️', name: 'Lake', color: '#4682B4' },
    { id: 'waterfall', emoji: '💦', name: 'Waterfall', color: '#00BFFF' },
    { id: 'cave', emoji: '🕳️', name: 'Cave', color: '#696969' },
    { id: 'volcano', emoji: '🌋', name: 'Volcano', color: '#8B0000' },
  ],
  business: [
    { id: 'briefcase', emoji: '💼', name: 'Briefcase', color: '#8B4513' },
    { id: 'meeting', emoji: '👥', name: 'Meeting', color: '#4682B4' },
    { id: 'presentation', emoji: '📊', name: 'Presentation', color: '#4169E1' },
    { id: 'laptop', emoji: '💻', name: 'Laptop', color: '#696969' },
    { id: 'conference', emoji: '🏢', name: 'Conference', color: '#A9A9A9' },
    { id: 'business-class', emoji: '✈️', name: 'Business Class', color: '#000080' },
    { id: 'hotel', emoji: '🏨', name: 'Hotel', color: '#8B0000' },
    { id: 'handshake', emoji: '🤝', name: 'Handshake', color: '#CD853F' },
    { id: 'business-card', emoji: '📇', name: 'Business Card', color: '#FFFFFF' },
  ],
  leisure: [
    { id: 'poolside', emoji: '🏊', name: 'Poolside', color: '#00BFFF' },
    { id: 'resort', emoji: '🏖️', name: 'Resort', color: '#FF8C00' },
    { id: 'golf', emoji: '⛳', name: 'Golf', color: '#006400' },
    { id: 'spa-treatment', emoji: '💆', name: 'Spa Treatment', color: '#DDA0DD' },
    { id: 'massage', emoji: '💆', name: 'Massage', color: '#E6E6FA' },
    { id: 'cocktail', emoji: '🍹', name: 'Cocktail', color: '#FF1493' },
    { id: 'swimming', emoji: '🏊', name: 'Swimming', color: '#1E90FF' },
    { id: 'sunbathing', emoji: '🌞', name: 'Sunbathing', color: '#FFD700' },
    { id: 'reading', emoji: '📚', name: 'Reading', color: '#8B4513' },
  ],
  pets: [
    { id: 'dog', emoji: '🐕', name: 'Dog', color: '#CD853F' },
    { id: 'cat', emoji: '🐈', name: 'Cat', color: '#A0522D' },
    { id: 'pet-friendly', emoji: '🐾', name: 'Pet Friendly', color: '#8B4513' },
    { id: 'pet-hotel', emoji: '🏨', name: 'Pet Hotel', color: '#4682B4' },
    { id: 'pet-carrier', emoji: '🧳', name: 'Pet Carrier', color: '#696969' },
    { id: 'pet-park', emoji: '🌳', name: 'Pet Park', color: '#228B22' },
    { id: 'pet-beach', emoji: '🏖️', name: 'Pet Beach', color: '#FFD700' },
    { id: 'pet-supplies', emoji: '🦴', name: 'Pet Supplies', color: '#A52A2A' },
  ]
};

const TravelStickers = ({ onSelectSticker }) => {
  const [activeCategory, setActiveCategory] = React.useState('happiness');

  const handleStickerClick = (sticker) => {
    if (onSelectSticker) {
      onSelectSticker({
        type: 'sticker',
        stickerType: sticker.id,
        emoji: sticker.emoji,
        name: sticker.name,
        color: sticker.color,
        width: 100,
        height: 100,
        x: 100,
        y: 100,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      });
    }
  };

  return (
    <div className="travel-stickers-container">
      <div className="sticker-categories">
        {Object.keys(travelStickers).map((category) => (
          <button
            key={category}
            className={`category-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="stickers-grid">
        {travelStickers[activeCategory].map((sticker) => (
          <div
            key={sticker.id}
            className="sticker-item"
            style={{ backgroundColor: sticker.color }}
            onClick={() => handleStickerClick(sticker)}
            title={sticker.name}
          >
            <span className="sticker-emoji">{sticker.emoji}</span>
            {/* Labels removed as per user request */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelStickers;
