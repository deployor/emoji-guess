import crypto from 'crypto';

export default function handler(req, res) {
  const questions = [
    {
      emoji: '🍔💔',
      answer: 'Heartbreak',
      distractors: ['Burger Love', 'Broken Burger', 'Fast Food Love', 'Snack Time', 'Cooking Show', 'Grill Master', 'Cheeseburger', 'Lunch'],
    },
    {
      emoji: '🌧️☔',
      answer: 'Rainy Day',
      distractors: ['Umbrella', 'Sunny Weather', 'Snowstorm', 'Beach Day', 'Cloud Watching', 'Picnic Time', 'Rainbow', 'Storm Chase'],
    },
    {
      emoji: '🔥🐉',
      answer: 'Dragonfire',
      distractors: ['Hot Dragon', 'Pet Lizard', 'Fireplace', 'Spicy Food', 'Barbecue', 'Campfire', 'Flamingo', 'Sunburn'],
    },
    { emoji: '🍕🍴⏰', answer: 'Pizza Time', distractors: ['Apple Tree', 'Dog Walk', 'Purple Hat', 'Guitar String'] },
    { emoji: '🎂🎈🎉', answer: 'Birthday', distractors: ['Laptop', 'Candle Store', 'Soccer Ball', 'Mountain Climb'] },
    { emoji: '🛏️💤🌙', answer: 'Sleep', distractors: ['Car Wash', 'Ice Cream', 'Red Paint', 'Basketball Game'] },
    { emoji: '🐕🦴🏡', answer: 'Dog at Home', distractors: ['Spaceship', 'Pink Shoes', 'Cooking Class', 'Green Paper'] },
    { emoji: '🎄🎅🎁', answer: 'Christmas', distractors: ['Football', 'Laptop', 'Ocean Waves', 'Banana Peel'] },
    { emoji: '🚗🛣️📍', answer: 'Road Trip', distractors: ['Garden Tools', 'Book Club', 'Swimming Pool', 'Blue Jacket'] },
    { emoji: '🌞���️🌊', answer: 'Beach Day', distractors: ['Hot Chocolate', 'Space Walk', 'Math Homework', 'Apple Sauce'] },
    { emoji: '🍳🍞☕', answer: 'Breakfast', distractors: ['Video Game', 'Orange Hat', 'Movie Ticket', 'Red Backpack'] },
    { emoji: '🐟🌊🐠', answer: 'Fish in Water', distractors: ['Purple Notebook', 'Airplane Ticket', 'Giraffe Race', 'Soccer Field'] },
    { emoji: '📱💬🎙️', answer: 'Phone Call', distractors: ['Magic Show', 'Yellow Light', 'Chocolate Cake', 'Winter Gloves'] },
    { emoji: '🎵🎤🎸', answer: 'Music Performance', distractors: ['Car Garage', 'Picnic Basket', 'Hot Dog', 'Green Tea'] },
    { emoji: '🚪🔑🏡', answer: 'Unlock Door', distractors: ['Laptop Stand', 'Milkshake', 'Rainbow Skirt', 'Bowling Alley'] },
    { emoji: '🦁👑✨', answer: 'Lion King', distractors: ['Potato Chips', 'Silver Fork', 'Basketball Hoop', 'Paper Clips'] },
    { emoji: '⚽🥅🎯', answer: 'Goal Scored', distractors: ['Orange Sofa', 'Fishing Rod', 'Bluebird', 'Coffee Mug'] },
    { emoji: '🍎📚✏️', answer: 'School', distractors: ['Cooking Pan', 'Purple Balloon', 'Rainstorm', 'Skateboard'] },
    { emoji: '📚☕🕯️', answer: 'Reading Time', distractors: ['Electric Fan', 'Yellow Bike', 'Camping Tent', 'Football Game'] },
    { emoji: '🎮🕹️🖥️', answer: 'Video Game', distractors: ['Red Tomato', 'Science Kit', 'Chocolate Donut', 'Flower Vase'] },
    { emoji: '🎄⏰🎁', answer: 'Christmas Time', distractors: ['Blue Rocket', 'Fruit Bowl', 'Gold Chain', 'Soccer Team'] },
    { emoji: '🚲⛑️👕', answer: 'Bike Ride', distractors: ['Green Apple', 'Math Exam', 'Watermelon', 'Office Chair'] },
    { emoji: '🍇🍷🧺', answer: 'Wine Picnic', distractors: ['Rainbow Kite', 'Soda Bottle', 'Camping Tent', 'Red Envelope'] },
    { emoji: '🛁🧼⏰', answer: 'Bath Time', distractors: ['Book Fair', 'Blue Sky', 'Sand Castle', 'Pink Slippers'] },
    { emoji: '🎓🎉🎈', answer: 'Graduation', distractors: ['Candy Store', 'Yellow Shoes', 'Train Station', 'Shopping Bag'] },
    { emoji: '🐱🐾🏠', answer: 'Cat at Home', distractors: ['Basketball Hoop', 'Milk Carton', 'Spaceship', 'Jungle Safari'] },
    { emoji: '🚀🌕⭐', answer: 'Moon Mission', distractors: ['Farmhouse', 'Ocean Wave', 'Yellow Book', 'Pink Dress'] },
    { emoji: '🍔🍟🥤', answer: 'Fast Food', distractors: ['Pencil Case', 'Green Tree', 'Hiking Boots', 'Silver Bracelet'] },
    { emoji: '🥗🥄⏰', answer: 'Salad Time', distractors: ['Jelly Beans', 'Movie Tickets', 'Orange Couch', 'Purple Shoe', 'Ice Cream Cone', 'Rocket Ship', 'Basketball Game', 'Yellow Star', 'Blue Umbrella'] },
    { emoji: '🦊🌲🔥', answer: 'Fox in the Forest', distractors: ['Car Mechanic', 'Rainbow Cookies', 'Hot Dog', 'Magic Potion', 'Ocean Waves', 'Pink Notebook', 'Giant Clock', 'Laptop Case', 'Airplane Ride'] },
    { emoji: '🌮🍹⏰', answer: 'Taco Time', distractors: ['Red Envelope', 'Soccer Net', 'Washing Machine', 'Green Plant', 'Skydiving Gear', 'Yellow Scooter', 'Silver Spoon', 'Train Station', 'Fish Tank'] },
    { emoji: '🐒🍌🌴', answer: 'Monkey in Jungle', distractors: ['Watermelon', 'Umbrella Stand', 'Paper Airplane', 'Blue Kite', 'Hot Coffee', 'Purple Carpet', 'Basketball Hoop', 'Giraffe Party', 'Gold Watch'] },
    { emoji: '🚂🌉🎒', answer: 'Train Journey', distractors: ['Space Car', 'Rainbow Ladder', 'Green Tea', 'Pink Headphones', 'Laptop Stand', 'Shopping Bag', 'Chessboard', 'Orange Umbrella', 'Skateboard Ramp'] },
    { emoji: '🎧🎶💻', answer: 'Listening to Music', distractors: ['Brown Table', 'Lemonade Stand', 'Red Balloon', 'Garden Hose', 'Jellyfish', 'Purple Pillow', 'Science Experiment', 'Fishing Pole', 'Goldfish Bowl'] },
    { emoji: '🍉🍓🍹', answer: 'Fruit Smoothie', distractors: ['Book Club', 'Silver Tray', 'Yoga Mat', 'Hiking Boots', 'Candle Holder', 'Video Game', 'Golden Trophy', 'Flashlight', 'Spaceship'] },
    { emoji: '🛫🌍🧳', answer: 'World Travel', distractors: ['Blue Socks', 'Soda Can', 'Football Jersey', 'Pineapple Slice', 'Ice Cream Cone', 'Guitar String', 'Pink Hat', 'Couch Cushion', 'Raincoat'] },
    { emoji: '🦁🌳🏞️', answer: 'Safari Adventure', distractors: ['Library Book', 'Yellow Pen', 'Hot Pizza', 'Science Fair', 'Mountain Dew', 'Red Chair', 'Sandwich Bag', 'Marble Statue', 'Toy Car'] },
    { emoji: '📖🕯️☕', answer: 'Reading Time', distractors: ['Pencil Box', 'Hot Chocolate', 'Orange Door', 'Sushi Roll', 'Window Blinds', 'Rainbow Tie', 'Soccer Ball', 'Gold Chain', 'Running Shoes'] },
    { emoji: '🚴‍♀️🏔️⛑️', answer: 'Mountain Biking', distractors: ['White Plate', 'Ocean Reef', 'Laptop Keyboard', 'Pillow Cover', 'Starfish', 'Garden Hose', 'Purple Mug', 'Snow Shovel', 'Orange Candle'] },
    { emoji: '🍿🎥🎬', answer: 'Movie Night', distractors: ['Concert Tickets', 'Green Lamp', 'Beach Towel', 'Cooking Pan', 'Paper Airplane', 'Video Call', 'Basketball Court', 'Red Pen', 'Pink Gloves'] },
    { emoji: '🎮🕹️🖥️', answer: 'Gaming Time', distractors: ['Chessboard', 'Purple Glasses', 'Sandcastle', 'Toy Train', 'Wooden Spoon', 'Gold Medal', 'Blue Balloon', 'Red Carpet', 'Orange Chair'] },
    { emoji: '🛁🧽🧼', answer: 'Bath Time', distractors: ['Bicycle Ride', 'Yellow Helmet', 'Lemon Tea', 'Silver Key', 'Hiking Trail', 'Wooden Ruler', 'Book Stand', 'Birthday Hat', 'Swimming Goggles'] },
    { emoji: '📱📞💬', answer: 'Phone Call', distractors: ['Ice Cube', 'Rainbow Flag', 'Purple Kite', 'Cereal Bowl', 'Shower Curtain', 'Ocean Wave', 'Piano Keys', 'Cooking Pot', 'Jellyfish'] },
    { emoji: '🐸🌧️☔', answer: 'Frog in the Rain', distractors: ['Hot Chocolate', 'Golden Bridge', 'Snowstorm', 'Baking Sheet', 'Red Hat', 'Blue Couch', 'Silver Bells', 'Space Rocket', 'Yellow Umbrella'] },
    { emoji: '🌽🍅🥕', answer: 'Vegetable Garden', distractors: ['Fishing Line', 'Red Sofa', 'Chess Clock', 'Movie Poster', 'Diving Mask', 'Skating Rink', 'Soccer Net', 'Candle Wick', 'Paint Bucket'] },
    { emoji: '🍎🍇🥤', answer: 'Fruit Drink', distractors: ['Lunch Box', 'Green Towel', 'Pillow Case', 'Magic Wand', 'Science Kit', 'Yoga Mat', 'Running Shoes', 'Paper Clip', 'Chess Piece'] },
    { emoji: '🛶🌊🏞️', answer: 'Canoeing', distractors: ['Basketball Team', 'Flower Pot', 'School Desk', 'Train Ride', 'Paper Fan', 'Orange Blanket', 'Swimming Pool', 'Garden Fence', 'Toy Airplane'] },
    { emoji: '🐾🐕‍🦺🏡', answer: 'Dog at Home', distractors: ['Red Shoes', 'Football Helmet', 'Science Lab', 'Hot Stove', 'Rainbow Tie', 'Toy Bus', 'Fishing Pole', 'Candle Holder', 'Cooking Pan'] },
    { emoji: '🎓📜🎉', answer: 'Graduation', distractors: ['Yoga Class', 'Swimming Competition', 'Red Bike', 'Basketball Trophy', 'Black Belt', 'Silver Ring', 'Couch Cushion', 'Movie Set', 'Orange Juice'] }
  ];

  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];
  const options = [...question.distractors, question.answer];
  options.sort(() => Math.random() - 0.5);

  const timestamp = Date.now();
  const answerHash = crypto
    .createHash('sha256')
    .update(question.answer + process.env.ANSWER_SECRET + timestamp)
    .digest('hex');

  res.status(200).json({
    emoji: question.emoji,
    options,
    answerHash,
    timestamp
  });
}
