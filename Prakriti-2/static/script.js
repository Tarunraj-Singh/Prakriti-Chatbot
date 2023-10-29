const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;


const questions = [
  {
    question: "Hi, how may I help you?",
    options: ["I wanna know my Prakriti"],
  },
  {
    question: "How is your Visual Features?",
    options: ["Yellow-Tinged skin", "Emaciation", "Cracked Skin", "Clear skin", "Excessive Freckles", "Excessive Black Moles", "Acne/Pimples/Boils", "Compactness of body", "Firmness of body"],
  },
  {
    question: "How is your Tactile Features?",
    options: ["Dry", "Soft Muscles", "Lax Muscles"],
  },
  {
    question: "How are your Joints?",
    options: ["Poor", "Soft joints", "Loose joints", "Firmn, Strong joints"],
  },
  {
    question: "How are your Eyes?",
    options: ["Restless", "Sharp", "Light Coloured", "White Eyes-sclera", "Raddish angles of eyes"],
  },
  {
    question: "How are your Nails?",
    options: ["Rough", "Coppery", "Pink", "Strong", "Smooth"],
  },
  {
    question: "How are your Teeth?",
    options: ["Rough", "Medium Sized", "Sensitive", "Sharp",],
  },
  {
    question: "How is your Mouth?",
    options: ["Rough", "Warm", "Bad Breath", "Moderate"],
  },
  {
    question: "How are your Palm and Sole?",
    options: ["Rough", "Soft", "Pinkish", "Smooth"],
  },
  {
    question: "How is your Hair?",
    options: ["Rough", "Brown", "Curly hairs", "Firm hairs", "Soft", "Moderate thick", "Fine"],
  },
  {
    question: "How is your Voice Assessment?",
    options: ["Dry", "Broken", "Low", "Articulate", "Medium pitch", "Clear"],
  },
  {
    question: "How is your Sleep Pattern?",
    options: ["Very light", "Intense", "Vivid", "Prone to disturbance", "Very deep sleeper"],
  },
  {
    question: "How is your Movement and Gait?",
    options: ["Quick,light movements", "Hurried movements", "Quick,light gait", "Purposeful", "Quick", "Sharp"],
  },
  {
    question: "How is your Diet and Lifestyle?",
    options: ["Poor", "Voracious eater", "Excessive thirst", "High fluid intake", "Poor appetite", "Less Thirst", "Slow eater"],
  },
  {
    question: "How are your Excretory Products?",
    options: ["Profuse sweating", "Minimal sweating", "Excretory sweating", "Excessive micturation", "Strong odor", "Yellowish colour"],
  }
];

let currentQuestion = 0;

// Create a chat message with options
// const createQuestionMessage = (question) => {
//   const questionMessage = createChatLi(question.question, "incoming");
//   question.options.forEach((option) => {
//     const optionButton = document.createElement("button");
//     optionButton.textContent = option;
//     optionButton.classList.add("option-button");
//     opttionMessage.appendChild(optionButton);
//   });ionButton.addEventListener("click", () => handleUserChoice(option));
//     ques
//   chatbox.appendChild(questionMessage);
// };
const createQuestionMessage = (question) => {
  const questionMessage = createChatLi(question.question, "incoming");
  chatbox.appendChild(questionMessage); // Append the question message

  const optionContainer = document.createElement("div"); // Create a container for options
  optionContainer.classList.add("options-container");
  question.options.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.textContent = option;
    optionButton.classList.add("option"); // Use the correct class name here
    optionButton.addEventListener("click", () => handleUserChoice(option));
    optionContainer.appendChild(optionButton);
  });

  chatbox.appendChild(optionContainer); // Append the options container
  chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
};

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<p><span class="material-symbols-outlined">smart_toy</span>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

// Array to store user choices
const userChoices = [];

const handleUserChoice = (choice) => {
  chatbox.querySelectorAll(".options-container").forEach((container) => {
    container.style.display = "none"; // Hide options containers
  });
  if (currentQuestion != 0) {
    // Skip storing choice for the welcome message
    userChoices.push([choice]);
    
  } 
  
  // userChoices.push([choice]); // Store the user's choice in the array
  const userChoiceMessage = createChatLi(`${choice}`, "outgoing");
  chatbox.appendChild(userChoiceMessage);
  sendBotResponse(choice); // Send the user's choice to the bot
};

// const sendBotResponse = (userChoice) => {
//   // Simulate a bot response based on user choice (replace with your logic)
//   setTimeout(() => {
//     const botResponse = `You selected ${userChoice}`;
//     chatbox.appendChild(createChatLi(botResponse, "incoming"));
//     if (currentQuestion < questions.length - 1) {
//       currentQuestion++; // Move to the next question
//       createQuestionMessage(questions[currentQuestion]);
//     } else {
//       // Chatbot reached the end of questions
//       chatInput.disabled = true; // Disable input after finishing questions
//     }
//   }, 1000); // Simulate a 1-second delay
// };
const sendBotResponse = (userChoice) => {
  // Simulate a bot response based on user choice (replace with your logic)
  setTimeout(() => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++; // Move to the next question
      createQuestionMessage(questions[currentQuestion]);
    } else {
      chatInput.disabled = true; // Disable input after finishing questions
      console.log("User Choices:", userChoices);

      // When chat ends, send userChoices to your app.py
      fetch("/process_user_input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userChoices })
      })
        .then((response) => {
          if (response.ok) {
            console.log("User choices sent to the backend successfully.");
            return response.json(); // Parse the JSON response
          } else {
            console.error("Failed to send user choices to the backend.");
            throw new Error("Network response was not ok");
          }
        })
        .then((data) => {
          console.log(data);  // Add this line to log the data
          const botResponseMessage = createChatLi(data.botResponse, "incoming");
          chatbox.appendChild(botResponseMessage);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, 500);
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));

  setTimeout(() => {
    chatbox.appendChild(createChatLi("Thinking", "incoming"));
    sendBotResponse();
  }, 600);

  chatInput.value = ""; // Clear the input field
};

sendChatBtn.addEventListener("click", handleChat);

// Listen for the Enter key (key code 13)
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleChat();
  }
});

// Start the chat by displaying the first question
createQuestionMessage(questions[currentQuestion]);
