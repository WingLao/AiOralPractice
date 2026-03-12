// Copy the content of your data.json here, but export it
const data = {
    "sets": [
      {
        "setNumber": 1,
        "title": "I'm your waiter",
        "theme": "Daily Life & Social Interaction",
        "emoji": "🍽️",
        "candidateRole": "Customer",
        "examinerRole": "Waiter",
        "cue": "The examiner is your waiter. You are ordering food at a restaurant. You should talk about:",
        "candidateCueCard": [
          "What you want to eat",
          "Ask about vegetarian options",
          "Ask about the price"
        ],
        "backupQuestions": [
          "How can I help you?",
          "Do you have any preference?",
          "Do you prefer spicy or sweet food?"
        ]
      },
      {
        "setNumber": 2,
        "title": "I'm the shop assistant",
        "theme": "Daily Life & Social Interaction",
        "emoji": "👕",
        "candidateRole": "Customer",
        "examinerRole": "Shop Assistant",
        "cue": "The examiner is the shop assistant. You want to return a shirt. You should talk about:",
        "candidateCueCard": [
          "Why you want to return the shirt",
          "Ask for a refund or exchange",
          "What you want instead"
        ],
        "backupQuestions": [
          "When did you buy it?",
          "Do you have the receipt?",
          "What was wrong with the shirt?"
        ]
      },
      {
        "setNumber": 3,
        "title": "I'm the hotel receptionist",
        "theme": "Travel & Leisure",
        "emoji": "🏨",
        "candidateRole": "Guest",
        "examinerRole": "Hotel Receptionist",
        "cue": "The examiner is the hotel receptionist. You want to book a room. You should talk about:",
        "candidateCueCard": [
          "Ask about availability for two nights",
          "Ask about the price per night",
          "Ask if breakfast is included",
          "Confirm your booking"
        ],
        "backupQuestions": [
          "Do you prefer a single or double room?",
          "What date would you like to check in?",
          "Do you need parking?"
        ]
      },
      {
        "setNumber": 4,
        "title": "I'm a local resident",
        "theme": "Travel & Leisure",
        "emoji": "🗺️",
        "candidateRole": "Tourist",
        "examinerRole": "Local Resident",
        "cue": "The examiner is a local resident. You are asking for directions in a new city. You should talk about:",
        "candidateCueCard": [
          "Ask for directions to the train station",
          "Ask how long it takes to walk",
          "Ask about nearby landmarks"
        ],
        "backupQuestions": [
          "Do you have a map?",
          "Are you looking for the quickest way or the scenic way?",
          "Which landmark in our city do you want to visit most?"
        ]
      },
      {
        "setNumber": 5,
        "title": "I'm your teacher",
        "theme": "School & Study",
        "emoji": "🧑‍🏫",
        "candidateRole": "Student",
        "examinerRole": "Teacher",
        "cue": "The examiner is your teacher. You want to ask for help with your homework. You should talk about:",
        "candidateCueCard": [
          "What subject you need help with",
          "What you don't understand",
          "When you need the help"
        ],
        "backupQuestions": [
          "What is the topic?",
          "Did you try it already?",
          "Do you have the textbook?"
        ]
      },
      {
        "setNumber": 6,
        "title": "I'm your classmate",
        "theme": "School & Study",
        "emoji": "🎒",
        "candidateRole": "Student",
        "examinerRole": "Classmate",
        "cue": "The examiner is your classmate. You missed a class. You should talk about:",
        "candidateCueCard": [
          "Ask what was covered",
          "Ask for notes",
          "Ask about homework"
        ],
        "backupQuestions": [
          "Why did you miss class?",
          "Do you want to study together?",
          "How can I help you?"
        ]
      },
      {
        "setNumber": 7,
        "title": "I'm the receptionist",
        "theme": "Work & Services",
        "emoji": "🩺",
        "candidateRole": "Customer",
        "examinerRole": "Receptionist",
        "cue": "The examiner is the receptionist. You want to make a doctor's appointment. You should talk about:",
        "candidateCueCard": [
          "Say what the problem is",
          "Ask for the earliest appointment",
          "Ask about the doctor's availability"
        ],
        "backupQuestions": [
          "Do you need a specialist?",
          "Have you been here before?",
          "Do you have insurance?"
        ]
      },
      {
        "setNumber": 8,
        "title": "I'm the bank clerk",
        "theme": "Work & Services",
        "emoji": "🏦",
        "candidateRole": "Customer",
        "examinerRole": "Bank Clerk",
        "cue": "The examiner is the bank clerk. You want to open a bank account. You should talk about:",
        "candidateCueCard": [
          "Ask what documents are needed",
          "Ask about account types",
          "Ask about online banking"
        ],
        "backupQuestions": [
          "Do you have ID?",
          "Do you want a savings or checking account?",
          "Do you have any specific banking goals?"
        ]
      },
      {
        "setNumber": 9,
        "title": "I'm the hotel staff",
        "theme": "Emergencies & Problem-Solving",
        "emoji": "🔑",
        "candidateRole": "Customer",
        "examinerRole": "Hotel Staff",
        "cue": "The examiner is the hotel staff. You lost your room key. You should talk about:",
        "candidateCueCard": [
          "Explain the situation",
          "Ask for a new key",
          "Ask about security"
        ],
        "backupQuestions": [
          "Where did you last see it?",
          "What is your room number?",
          "Do you have ID?"
        ]
      },
      {
        "setNumber": 10,
        "title": "I'm the airline staff",
        "theme": "Emergencies & Problem-Solving",
        "emoji": "✈️",
        "candidateRole": "Passenger",
        "examinerRole": "Airline Staff",
        "cue": "The examiner is the airline staff. Your flight was cancelled. You should talk about:",
        "candidateCueCard": [
          "Ask why it was cancelled",
          "Ask about the next flight",
          "Ask for a refund or hotel"
        ],
        "backupQuestions": [
          "May I see your boarding pass?",
          "Do you have any checked luggage?",
          "Would you prefer to fly in the morning or evening?"
        ]
      },
      {
        "setNumber": 11,
        "title": "I'm the librarian",
        "theme": "School & Study",
        "emoji": "📖",
        "candidateRole": "Student",
        "examinerRole": "Librarian",
        "cue": "The examiner is the librarian. You want to borrow a book. You should talk about:",
        "candidateCueCard": [
          "Ask if the book is available",
          "Ask how long you can keep it",
          "Ask about late fees"
        ],
        "backupQuestions": [
          "Do you have a library card?",
          "What type of books are you looking for today?",
          "When are you planning to return it?"
        ]
      },
      {
        "setNumber": 12,
        "title": "I'm the gym instructor",
        "theme": "Health & Fitness",
        "emoji": "🏋️",
        "candidateRole": "New Member",
        "examinerRole": "Gym Instructor",
        "cue": "The examiner is the gym instructor. You want to join the gym. You should talk about:",
        "candidateCueCard": [
          "Ask about membership fees",
          "Ask about class schedules",
          "Ask for a tour"
        ],
        "backupQuestions": [
          "Have you been to a gym before?",
          "Do you prefer cardio or weights?",
          "When do you usually work out?"
        ]
      },
      {
        "setNumber": 13,
        "title": "I'm the bus driver",
        "theme": "Travel & Leisure",
        "emoji": "🚌",
        "candidateRole": "Passenger",
        "examinerRole": "Bus Driver",
        "cue": "The examiner is the bus driver. You want to go to the city center. You should talk about:",
        "candidateCueCard": [
          "Ask which bus to take",
          "Ask about the fare",
          "Ask where to get off"
        ],
        "backupQuestions": [
          "Do you have a bus pass?",
          "Where are you trying to go?",
          "Do you have exact change?"
        ]
      },
      {
        "setNumber": 14,
        "title": "I'm the neighbor",
        "theme": "Daily Life & Social Interaction",
        "emoji": "🏡",
        "candidateRole": "New Neighbor",
        "examinerRole": "Neighbor",
        "cue": "The examiner is your neighbor. You just moved in. You should talk about:",
        "candidateCueCard": [
          "Introduce yourself",
          "Ask about the neighborhood",
          "Ask for recommendations"
        ],
        "backupQuestions": [
          "Where did you move from?",
          "Do you have family here?",
          "Do you need help with anything?"
        ]
      },
      {
        "setNumber": 15,
        "title": "I'm the post office clerk",
        "theme": "Work & Services",
        "emoji": "📦",
        "candidateRole": "Customer",
        "examinerRole": "Post Office Clerk",
        "cue": "The examiner is the post office clerk. You want to send a package. You should talk about:",
        "candidateCueCard": [
          "Ask about postage cost",
          "Ask how long it will take",
          "Ask about tracking"
        ],
        "backupQuestions": [
          "Where are you sending it?",
          "Is it fragile?",
          "Do you want insurance?"
        ]
      },
      {
        "setNumber": 16,
        "title": "I'm the movie theater staff",
        "theme": "Travel & Leisure",
        "emoji": "🍿",
        "candidateRole": "Customer",
        "examinerRole": "Movie Theater Staff",
        "cue": "The examiner is the movie theater staff. You want to buy tickets. You should talk about:",
        "candidateCueCard": [
          "Ask what movies are playing",
          "Ask about showtimes",
          "Ask about ticket prices"
        ],
        "backupQuestions": [
          "How many tickets do you need?",
          "Do you want popcorn?",
          "Do you prefer seating in front?"
        ]
      },
      {
        "setNumber": 17,
        "title": "I'm the tour guide",
        "theme": "Travel & Leisure",
        "emoji": "🚩",
        "candidateRole": "Tourist",
        "examinerRole": "Tour Guide",
        "cue": "The examiner is the tour guide. You are on a city tour. You should talk about:",
        "candidateCueCard": [
          "Ask about the next stop",
          "Ask about the history of the place",
          "Ask where to take photos"
        ],
        "backupQuestions": [
          "Do you have any other plans?",
          "How did you hear about this tour?",
          "Do you have any allergies?"
        ]
      },
      {
        "setNumber": 18,
        "title": "I'm the police officer",
        "theme": "Emergencies & Problem-Solving",
        "emoji": "👮",
        "candidateRole": "Citizen",
        "examinerRole": "Police Officer",
        "cue": "The examiner is the police officer. You lost your wallet. You should talk about:",
        "candidateCueCard": [
          "Explain what happened",
          "Ask what to do next",
          "Ask if you need to file a report"
        ],
        "backupQuestions": [
          "Where did you lose it?",
          "Do you remember what was inside?",
          "Do you have identification?"
        ]
      },
      {
        "setNumber": 19,
        "title": "I'm the taxi driver",
        "theme": "Travel & Leisure",
        "emoji": "🚖",
        "candidateRole": "Passenger",
        "examinerRole": "Taxi Driver",
        "cue": "The examiner is the taxi driver. You want to go to the airport. You should talk about:",
        "candidateCueCard": [
          "Ask how long it will take",
          "Ask about the fare",
          "Ask if you can pay by card"
        ],
        "backupQuestions": [
          "Do you want to take the highway or the local roads?",
          "Do you have luggage?",
          "What terminal are you going to?"
        ]
      },
      {
        "setNumber": 20,
        "title": "I'm the phone customer service",
        "theme": "Work & Services",
        "emoji": "📞",
        "candidateRole": "Customer",
        "examinerRole": "Customer Service",
        "cue": "The examiner is the phone customer service. You have a problem with your bill. You should talk about:",
        "candidateCueCard": [
          "Explain the problem",
          "Ask for a correction",
          "Ask about payment options"
        ],
        "backupQuestions": [
          "What is your account number?",
          "When did you notice the issue?",
          "Do you want a paper or digital bill?"
        ]
      },
      {
        "setNumber": 21,
        "title": "I'm the restaurant chef",
        "theme": "Daily Life & Social Interaction",
        "emoji": "👨‍🍳",
        "candidateRole": "Customer",
        "examinerRole": "Chef",
        "cue": "The examiner is the chef. You have a food allergy. You should talk about:",
        "candidateCueCard": [
          "Explain your allergy",
          "Ask about ingredients",
          "Ask for a special dish"
        ],
        "backupQuestions": [
          "How severe is your allergy?",
          "Do you carry medication?",
          "Is there anything else I can assist you with today?"
        ]
      },
      {
        "setNumber": 22,
        "title": "I'm the job interviewer",
        "theme": "Work & Services",
        "emoji": "🤝",
        "candidateRole": "Job Applicant",
        "examinerRole": "Interviewer",
        "cue": "The examiner is the job interviewer. You are applying for a job. You should talk about:",
        "candidateCueCard": [
          "Introduce yourself",
          "Talk about your experience",
          "Ask about the salary"
        ],
        "backupQuestions": [
          "Why do you want this job?",
          "What are your strengths?",
          "When can you start working?"
        ]
      },
      {
        "setNumber": 23,
        "title": "I'm the fitness trainer",
        "theme": "Health & Fitness",
        "emoji": "🥗",
        "candidateRole": "Client",
        "examinerRole": "Fitness Trainer",
        "cue": "The examiner is the fitness trainer. You want to lose weight. You should talk about:",
        "candidateCueCard": [
          "Explain your goal",
          "Ask for a workout plan",
          "Ask about diet tips"
        ],
        "backupQuestions": [
          "How often do you exercise?",
          "Do you have any injuries?",
          "What does your typical diet look like?"
        ]
      },
      {
        "setNumber": 24,
        "title": "I'm the airport security",
        "theme": "Travel & Leisure",
        "emoji": "🧳",
        "candidateRole": "Passenger",
        "examinerRole": "Security Officer",
        "cue": "The examiner is the airport security. Your bag is being checked. You should talk about:",
        "candidateCueCard": [
          "Explain what is in your bag",
          "Ask why it was selected",
          "Ask how long it will take"
        ],
        "backupQuestions": [
          "Did you pack your bag yourself?",
          "Do you have liquids?",
          "Is this your first time flying?"
        ]
      },
      {
        "setNumber": 25,
        "title": "I'm the real estate agent",
        "theme": "Work & Services",
        "emoji": "🏠",
        "candidateRole": "Buyer",
        "examinerRole": "Real Estate Agent",
        "cue": "The examiner is the real estate agent. You want to buy a house. You should talk about:",
        "candidateCueCard": [
          "Explain your budget",
          "Ask about neighborhoods",
          "Ask to see a property"
        ],
        "backupQuestions": [
          "Do you have a family?",
          "Do you need a mortgage?",
          "When do you want to move?"
        ]
      },
      {
        "setNumber": 26,
        "title": "I'm the travel agent",
        "theme": "Travel & Leisure",
        "emoji": "🏖️",
        "candidateRole": "Customer",
        "examinerRole": "Travel Agent",
        "cue": "The examiner is the travel agent. You want to book a holiday. You should talk about:",
        "candidateCueCard": [
          "Explain your destination",
          "Ask about flight options",
          "Ask about hotels"
        ],
        "backupQuestions": [
          "When do you want to travel?",
          "How many people are going?",
          "Do you want to buy travelling insurance?"
        ]
      },
      {
        "setNumber": 27,
        "title": "I'm the car rental agent",
        "theme": "Travel & Leisure",
        "emoji": "🚗",
        "candidateRole": "Customer",
        "examinerRole": "Car Rental Agent",
        "cue": "The examiner is the car rental agent. You want to rent a car. You should talk about:",
        "candidateCueCard": [
          "Ask about car types",
          "Ask about rental costs",
          "Ask about insurance"
        ],
        "backupQuestions": [
          "Do you have a driver's license?",
          "How long do you need it?",
          "Do you want GPS?"
        ]
      },
      {
        "setNumber": 28,
        "title": "I'm the IT support",
        "theme": "Work & Services",
        "emoji": "💻",
        "candidateRole": "User",
        "examinerRole": "IT Support",
        "cue": "The examiner is the IT support. Your computer is not working. You should talk about:",
        "candidateCueCard": [
          "Explain the problem",
          "Ask for help",
          "Ask how to prevent it"
        ],
        "backupQuestions": [
          "Is it a laptop or desktop?",
          "Did you install anything new?",
          "Have you restarted it?"
        ]
      },
      {
        "setNumber": 29,
        "title": "I'm the pharmacist",
        "theme": "Health & Fitness",
        "emoji": "💊",
        "candidateRole": "Customer",
        "examinerRole": "Pharmacist",
        "cue": "The examiner is the pharmacist. You need medicine for a cold. You should talk about:",
        "candidateCueCard": [
          "Explain your symptoms",
          "Ask for medicine",
          "Ask about side effects"
        ],
        "backupQuestions": [
          "Are you allergic to anything?",
          "Do you have a fever?",
          "Do you need a prescription?"
        ]
      },
      {
        "setNumber": 30,
        "title": "I'm the event planner",
        "theme": "Daily Life & Social Interaction",
        "emoji": "🎉",
        "candidateRole": "Client",
        "examinerRole": "Event Planner",
        "cue": "The examiner is the event planner. You want to plan a birthday party. You should talk about:",
        "candidateCueCard": [
          "Explain the event",
          "Ask about venues",
          "Ask about food options"
        ],
        "backupQuestions": [
          "How many guests are coming?",
          "Do you have a budget?",
          "Do you need decorations?"
        ]
      },
      {
        "setNumber": 31,
        "title": "I'm the museum guide",
        "theme": "Travel & Leisure",
        "emoji": "🖼️",
        "candidateRole": "Visitor",
        "examinerRole": "Museum Guide",
        "cue": "The examiner is the museum guide. You are visiting an art museum. You should talk about:",
        "candidateCueCard": [
          "Ask about the most famous painting",
          "Ask for a map",
          "Ask about the history"
        ],
        "backupQuestions": [
          "Do you like modern art?",
          "Are you here alone?",
          "Do you want an audio guide?"
        ]
      },
      {
        "setNumber": 32,
        "title": "I'm the delivery person",
        "theme": "Daily Life & Social Interaction",
        "emoji": "🚚",
        "candidateRole": "Customer",
        "examinerRole": "Delivery Person",
        "cue": "The examiner is the delivery person. You are receiving a package. You should talk about:",
        "candidateCueCard": [
          "Confirm your address",
          "Ask to leave it somewhere",
          "Sign for the package"
        ],
        "backupQuestions": [
          "Is this your name?",
          "Do you want it inside?",
          "Can I help you with anything else regarding your order?"
        ]
      },
      {
        "setNumber": 33,
        "title": "I'm the parking attendant",
        "theme": "Travel & Leisure",
        "emoji": "🅿️",
        "candidateRole": "Driver",
        "examinerRole": "Parking Attendant",
        "cue": "The examiner is the parking attendant. You want to park your car. You should talk about:",
        "candidateCueCard": [
          "Ask about parking fees",
          "Ask how long you can park",
          "Ask where to pay"
        ],
        "backupQuestions": [
          "Is this your first time parking here?",
          "How long do you plan to stay?",
          "Do you need assistance?"
        ]
      },
      {
        "setNumber": 34,
        "title": "I'm the hairdresser",
        "theme": "Daily Life & Social Interaction",
        "emoji": "💇",
        "candidateRole": "Client",
        "examinerRole": "Hairdresser",
        "cue": "The examiner is the hairdresser. You want to haircut. You should talk about:",
        "candidateCueCard": [
          "Explain what you want",
          "Ask about the price",
          "Ask how long it will take"
        ],
        "backupQuestions": [
          "Do you want a wash?",
          "Do you have a photo?",
          "How short do you want it?"
        ]
      },
      {
        "setNumber": 35,
        "title": "I'm the vet",
        "theme": "Health & Fitness",
        "emoji": "🐕",
        "candidateRole": "Pet Owner",
        "examinerRole": "Vet",
        "cue": "The examiner is the vet. Your pet is sick. You should talk about:",
        "candidateCueCard": [
          "Explain the symptoms",
          "Ask for advice",
          "Ask about medicine"
        ],
        "backupQuestions": [
          "How old is your pet?",
          "Has this happened before?",
          "Is it eating normally?"
        ]
      },
      {
        "setNumber": 36,
        "title": "I'm the hotel concierge",
        "theme": "Travel & Leisure",
        "emoji": "🛎️",
        "candidateRole": "Guest",
        "examinerRole": "Concierge",
        "cue": "The examiner is the hotel concierge. You want recommendations. You should talk about:",
        "candidateCueCard": [
          "Ask for restaurant suggestions",
          "Ask about tourist attractions",
          "Ask how to get there"
        ],
        "backupQuestions": [
          "Do you like local food?",
          "Are you here for business?",
          "Do you need a taxi?"
        ]
      },
      {
        "setNumber": 37,
        "title": "I'm the insurance agent",
        "theme": "Work & Services",
        "emoji": "🛡️",
        "candidateRole": "Customer",
        "examinerRole": "Insurance Agent",
        "cue": "The examiner is the insurance agent. You want to buy car insurance. You should talk about:",
        "candidateCueCard": [
          "Ask about coverage",
          "Ask about the price",
          "Ask about the claims process"
        ],
        "backupQuestions": [
          "What car do you have?",
          "Do you have any accidents?",
          "Do you want monthly or yearly payment?"
        ]
      },
      {
        "setNumber": 38,
        "title": "I'm the language teacher",
        "theme": "School & Study",
        "emoji": "🗣️",
        "candidateRole": "Student",
        "examinerRole": "Language Teacher",
        "cue": "The examiner is the language teacher. You want to improve your speaking. You should talk about:",
        "candidateCueCard": [
          "Explain your goal",
          "Ask for practice tips",
          "Ask about class schedule"
        ],
        "backupQuestions": [
          "How long have you been studying?",
          "Do you practice at home?",
          "Do you watch movies in English?"
        ]
      },
      {
        "setNumber": 39,
        "title": "I'm the mechanic",
        "theme": "Work & Services",
        "emoji": "🔧",
        "candidateRole": "Customer",
        "examinerRole": "Mechanic",
        "cue": "The examiner is the mechanic. Your car is making a noise. You should talk about:",
        "candidateCueCard": [
          "Explain the problem",
          "Ask for a check-up",
          "Ask about the cost"
        ],
        "backupQuestions": [
          "When did it start?",
          "Do you have an appointment?",
          "What type of fuel do you tyically use?"
        ]
      },
      {
        "setNumber": 40,
        "title": "I'm the friend at a party",
        "theme": "Daily Life & Social Interaction",
        "emoji": "🥂",
        "candidateRole": "Guest",
        "examinerRole": "Friend",
        "cue": "The examiner is your friend at a party. You just arrived. You should talk about:",
        "candidateCueCard": [
          "Greet each other",
          "Ask about the host",
          "Ask about food and drinks"
        ],
        "backupQuestions": [
          "How do you know the host?",
          "Did you bring anything?",
          "Do you want to dance?"
        ]
      },
      {
        "setNumber": 41,
        "title": "I'm the lost & found officer",
        "theme": "Emergencies & Problem-Solving",
        "emoji": "🔎",
        "candidateRole": "Customer",
        "examinerRole": "Lost & Found Officer",
        "cue": "The examiner is the lost & found officer. You lost your phone. You should talk about:",
        "candidateCueCard": [
          "Describe your phone",
          "Where and when you last saw your phone",
          "Ask how to claim it"
        ],
        "backupQuestions": [
          "Where did you lose it?",
          "What color is it?",
          "Do you have the IMEI number?"
        ]
      },
      {
        "setNumber": 42,
        "title": "I'm the wedding planner",
        "theme": "Daily Life & Social Interaction",
        "emoji": "💍",
        "candidateRole": "Bride/Groom",
        "examinerRole": "Wedding Planner",
        "cue": "The examiner is the wedding planner. You are planning your wedding. You should talk about:",
        "candidateCueCard": [
          "Explain your vision",
          "Ask about venues",
          "Ask about the budget"
        ],
        "backupQuestions": [
          "How many guests?",
          "Do you have a date?",
          "Do you want a theme?"
        ]
      },
      {
        "setNumber": 43,
        "title": "I'm the career counselor",
        "theme": "Work & Services",
        "emoji": "🎓",
        "candidateRole": "Student",
        "examinerRole": "Career Counselor",
        "cue": "The examiner is the career counselor. You want advice about your future career. You should talk about:",
        "candidateCueCard": [
          "Explain your interests",
          "Ask about job opportunities",
          "Ask about required qualifications"
        ],
        "backupQuestions": [
          "What are you studying?",
          "Do you have work experience?",
          "What are you good at?"
        ]
      },
      {
        "setNumber": 44,
        "title": "I'm the supermarket cashier",
        "theme": "Daily Life & Social Interaction",
        "emoji": "🛒",
        "candidateRole": "Customer",
        "examinerRole": "Cashier",
        "cue": "The examiner is the supermarket cashier. You are at the checkout. You should talk about:",
        "candidateCueCard": [
          "Ask about the total",
          "Ask for a bag",
          "Ask about payment methods"
        ],
        "backupQuestions": [
          "Do you have a loyalty card?",
          "Do you want cashback?",
          "How would you like to pay?"
        ]
      },
      {
        "setNumber": 45,
        "title": "I'm the swimming pool lifeguard",
        "theme": "Health & Fitness",
        "emoji": "🏊",
        "candidateRole": "Swimmer",
        "examinerRole": "Lifeguard",
        "cue": "The examiner is the lifeguard. You want to swim. You should talk about:",
        "candidateCueCard": [
          "Ask about pool rules",
          "Ask about opening hours",
          "Ask where to change"
        ],
        "backupQuestions": [
          "Can you swim?",
          "Do you need goggles?",
          "Are you here alone?"
        ]
      },
      {
        "setNumber": 46,
        "title": "I'm the train station staff",
        "theme": "Travel & Leisure",
        "emoji": "🚆",
        "candidateRole": "Passenger",
        "examinerRole": "Train Station Staff",
        "cue": "The examiner is the train station staff. You want to buy a ticket. You should talk about:",
        "candidateCueCard": [
          "Ask about train times",
          "Ask about ticket prices",
          "Ask which platform to go to"
        ],
        "backupQuestions": [
          "Do you want a return ticket?",
          "Do you have a railcard?",
          "What time do you need to arrive?"
        ]
      },
      {
        "setNumber": 47,
        "title": "I'm the language exchange partner",
        "theme": "School & Study",
        "emoji": "💬",
        "candidateRole": "Language Learner",
        "examinerRole": "Language Partner",
        "cue": "The examiner is your language exchange partner. You want to practice speaking. You should talk about:",
        "candidateCueCard": [
          "Suggest a topic to discuss",
          "Ask for correction",
          "Ask about learning tips"
        ],
        "backupQuestions": [
          "How long have you been learning?",
          "Do you watch TV in English?",
          "What's difficult for you?"
        ]
      },
      {
        "setNumber": 48,
        "title": "I'm the coffee shop barista",
        "theme": "Daily Life & Social Interaction",
        "emoji": "☕",
        "candidateRole": "Customer",
        "examinerRole": "Barista",
        "cue": "The examiner is the barista. You want to order coffee. You should talk about:",
        "candidateCueCard": [
          "Ask about coffee types",
          "Ask about sizes",
          "Ask about the price"
        ],
        "backupQuestions": [
          "Do you want milk?",
          "Do you want it hot or iced?",
          "Do you want sugar?"
        ]
      },
      {
        "setNumber": 49,
        "title": "I'm the yoga instructor",
        "theme": "Health & Fitness",
        "emoji": "🧘",
        "candidateRole": "Student",
        "examinerRole": "Yoga Instructor",
        "cue": "The examiner is the yoga instructor. You want to join a yoga class. You should talk about:",
        "candidateCueCard": [
          "Ask about class levels",
          "Ask about class times",
          "Ask what to bring"
        ],
        "backupQuestions": [
          "Have you done yoga before?",
          "Do you have any injuries?",
          "Do you want to relax or exercise?"
        ]
      },
      {
        "setNumber": 50,
        "title": "I'm the tech store assistant",
        "theme": "Work & Services",
        "emoji": "🎧",
        "candidateRole": "Customer",
        "examinerRole": "Tech Store Assistant",
        "cue": "The examiner is the tech store assistant. You want to buy a new phone. You should talk about:",
        "candidateCueCard": [
          "Explain what you need",
          "Ask about different models",
          "Ask about the price"
        ],
        "backupQuestions": [
          "What is your budget?",
          "Do you want a camera phone?",
          "Do you need a data plan?"
        ]
      }
    ]
};

const exportedData = {
  sets: data.sets
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = exportedData;
}

if (typeof window !== 'undefined') {
  window.ENGLISH_DATA = exportedData;
}
