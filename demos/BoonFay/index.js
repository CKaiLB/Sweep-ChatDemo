// Survey data structure
const surveyData = {
    goal: "",
    age: "",
    height: "",
    weight: "",
    trainingDays: "",
    equipment: "",
    restrictions: "",
    mealPlan: "",
    dislikes: "",
    fullName: "",
    email: "",
    phone: "",
  }
  
  // Survey state
  let currentStep = 0
  const totalSteps = 10
  
  // Survey questions and options
  const surveySteps = [
    {
      title: "What's your main goal?",
      description: "Select the primary reason you want to start your fitness journey.",
      type: "radio",
      field: "goal",
      options: ["Fat loss", "Muscle gain", "General health", "Other"],
    },
    {
      title: "Tell us about yourself",
      description: "We need some basic information to create your personalized plan.",
      type: "inputs",
      fields: [
        { field: "age", label: "Age", type: "number", placeholder: "Enter your age" },
        { field: "height", label: "Height (in feet/inches or cm)", type: "text", placeholder: "e.g., 5'8\" or 173cm" },
        { field: "weight", label: "Weight (lbs or kg)", type: "text", placeholder: "e.g., 150 lbs or 68 kg" },
      ],
    },
    {
      title: "How many days per week can you train?",
      description: "Be realistic about your schedule and commitments.",
      type: "radio",
      field: "trainingDays",
      options: ["1-2 days", "3-4 days", "5-6 days", "7 days"],
    },
    {
      title: "What equipment do you have access to?",
      description: "This helps us design workouts that fit your setup.",
      type: "textarea",
      field: "equipment",
      placeholder: "e.g., Full gym, Home gym with dumbbells, Bodyweight only, Resistance bands, etc.",
    },
    {
      title: "Do you have any injuries or dietary restrictions?",
      description: "Please share any limitations we should consider in your plan.",
      type: "textarea",
      field: "restrictions",
      placeholder: "e.g., Lower back injury, Vegetarian, Gluten intolerance, None, etc.",
    },
    {
      title: "Do you prefer a simple or more varied meal plan?",
      description: "Choose what works best for your lifestyle and preferences.",
      type: "radio",
      field: "mealPlan",
      options: [
        "Simple - Same meals repeated",
        "Moderate - Some variety with rotation",
        "Varied - Different meals every day",
        "Very varied - Maximum diversity",
      ],
    },
    {
      title: "Any foods or workouts you hate?",
      description: "Let us know what to avoid in your personalized plan.",
      type: "textarea",
      field: "dislikes",
      placeholder: "e.g., Hate burpees, Don't like fish, Avoid running, No Brussels sprouts, etc.",
    },
    {
      title: "What's your full name?",
      description: "We'll use this to personalize your fitness plan.",
      type: "input",
      field: "fullName",
      inputType: "text",
      placeholder: "Enter your full name",
    },
    {
      title: "What's your email address?",
      description: "We'll send your personalized plan and updates here.",
      type: "input",
      field: "email",
      inputType: "email",
      placeholder: "Enter your email address",
    },
    {
      title: "What's your phone number?",
      description: "Optional: For important updates about your fitness journey.",
      type: "input",
      field: "phone",
      inputType: "tel",
      placeholder: "Enter your phone number",
    },
  ]
  
  // DOM elements
  const surveyContent = document.getElementById("survey-content")
  const currentStepElement = document.getElementById("current-step")
  const progressFill = document.getElementById("progress-fill")
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")
  const loadingScreen = document.getElementById("loading-screen")
  const resultsScreen = document.getElementById("results-screen")
  const resultsContent = document.getElementById("results-content")
  
  // Initialize survey
  function initSurvey() {
    renderStep()
    updateProgress()
    updateNavigation()
  }
  
  // Render current step
  function renderStep() {
    const step = surveySteps[currentStep]
    let html = `
          <div class="step active">
              <h2>${step.title}</h2>
              <p>${step.description}</p>
      `
  
    switch (step.type) {
      case "radio":
        html += `<div class="radio-group">`
        step.options.forEach((option, index) => {
          const isSelected = surveyData[step.field] === option
          html += `
                      <div class="radio-option ${isSelected ? "selected" : ""}" onclick="selectRadio('${step.field}', '${option}')">
                          <input type="radio" name="${step.field}" value="${option}" ${isSelected ? "checked" : ""}>
                          <label>${option}</label>
                      </div>
                  `
        })
        html += `</div>`
        break
  
      case "input":
        html += `
                  <div class="form-group">
                      <label class="form-label">${step.title}</label>
                      <input type="${step.inputType}" class="form-input" 
                             placeholder="${step.placeholder}" 
                             value="${surveyData[step.field]}"
                             onchange="updateSurveyData('${step.field}', this.value)">
                  </div>
              `
        break
  
      case "inputs":
        html += `<div class="input-grid">`
        step.fields.forEach((field) => {
          html += `
                      <div class="form-group">
                          <label class="form-label">${field.label}</label>
                          <input type="${field.type}" class="form-input" 
                                 placeholder="${field.placeholder}" 
                                 value="${surveyData[field.field]}"
                                 onchange="updateSurveyData('${field.field}', this.value)">
                      </div>
                  `
        })
        html += `</div>`
        break
  
      case "textarea":
        html += `
                  <div class="form-group">
                      <textarea class="form-textarea" 
                                placeholder="${step.placeholder}"
                                onchange="updateSurveyData('${step.field}', this.value)">${surveyData[step.field]}</textarea>
                  </div>
              `
        break
    }
  
    html += `</div>`
    surveyContent.innerHTML = html
  }
  
  // Update survey data
  function updateSurveyData(field, value) {
    surveyData[field] = value
    updateNavigation()
  }
  
  // Select radio option
  function selectRadio(field, value) {
    surveyData[field] = value
    renderStep()
    updateNavigation()
  }
  
  // Update progress bar and step counter
  function updateProgress() {
    const progress = ((currentStep + 1) / totalSteps) * 100
    progressFill.style.width = `${progress}%`
    currentStepElement.textContent = currentStep + 1
    document.querySelector(".progress-percent").textContent = `${Math.round(progress)}% Complete`
  }
  
  // Update navigation buttons
  function updateNavigation() {
    prevBtn.disabled = currentStep === 0
  
    const isValid = isStepValid()
    nextBtn.disabled = !isValid
  
    if (currentStep === totalSteps - 1) {
      nextBtn.innerHTML = `
              Generate My Plan
              <span class="btn-icon">✓</span>
          `
    } else {
      nextBtn.innerHTML = `
              Next
              <span class="btn-icon">→</span>
          `
    }
  }
  
  // Validate current step
  function isStepValid() {
    const step = surveySteps[currentStep]
  
    switch (step.type) {
      case "radio":
        return surveyData[step.field] !== ""
      case "input":
        return surveyData[step.field] !== ""
      case "inputs":
        return step.fields.every((field) => surveyData[field.field] !== "")
      case "textarea":
        return surveyData[step.field] !== ""
      default:
        return false
    }
  }
  
  // Navigate to previous step
  function previousStep() {
    if (currentStep > 0) {
      currentStep--
      renderStep()
      updateProgress()
      updateNavigation()
    }
  }
  
  // Navigate to next step or submit
  function nextStep() {
    if (currentStep < totalSteps - 1) {
      currentStep++
      renderStep()
      updateProgress()
      updateNavigation()
    } else {
      submitSurvey()
    }
  }
  
  // Submit survey
  async function submitSurvey() {
    // Show loading screen
    document.querySelector(".survey-card").style.display = "none"
    loadingScreen.classList.remove("hidden")
  
    console.log("Survey data prepared:", surveyData)
  
    try {
        // Get webhook URL from config
        const webhookUrl = window.FITNESS_SURVEY_CONFIG?.webhookUrl;
    
        if (!webhookUrl || webhookUrl === '' || webhookUrl === '__FITNESS_SURVEY_WEBHOOK_URL__') {
            console.warn("Using demo plan - Webhook URL not configured");
            throw new Error("Webhook URL not configured. Please set FitnessSurveyWebhookURL in your .env file and run the build script.");
        }
    
        console.log("Attempting to send request to webhook:", webhookUrl)
    
        // Format data for n8n webhook - using the same structure as other demos
        const webhookData = {
            action: "submitSurvey",
            sessionId: "fitness-survey-" + Date.now(),
            route: "survey",
            surveyData: surveyData,
            metadata: {
                userId: "",
                surveyType: "fitness"
            }
        };
    
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Origin": window.location.origin
            },
            mode: "cors",
            credentials: "omit",
            body: JSON.stringify(webhookData),
        })
    
        if (!response.ok) {
            console.error(`Webhook request failed with status: ${response.status}`)
            const errorText = await response.text()
            console.error("Error response:", errorText)
            throw new Error(`Webhook request failed with status: ${response.status} - ${errorText}`)
        }
    
        // Read response as text first for debugging
        const responseText = await response.text();
        console.log("Raw webhook response text:", responseText);
    
        // Try to parse the response as JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (jsonError) {
            console.error("Failed to parse webhook response as JSON:", jsonError);
            throw new Error(`Webhook response was not valid JSON. Response text: ${responseText.substring(0, 200)}...`);
        }
    
        console.log("Parsed webhook response:", result)
    
        // Expecting webhook to return an array like: [{"output":{"state":"<html1>"}}, {"output":{"state":"<html2>"}}]
        let finalHtmlContent = '';
    
        if (Array.isArray(result)) {
            console.log("Processing webhook response array...");
            // Iterate through each item in the array
            result.forEach((item, index) => {
                console.log(`Processing item at index ${index}:`, item);
                // Check if the nested output.state structure exists and contains a string
                if (item && typeof item === 'object' && item.output && typeof item.output === 'object' && item.output.state && typeof item.output.state === 'string') {
                    console.log(`Found valid output.state at index ${index}:`, item.output.state.substring(0, 100) + '...'); // Log a snippet
                    finalHtmlContent += item.output.state;
                } else {
                    console.warn("Skipping item in webhook response due to unexpected structure or missing content at index", index, ":", item);
                }
            });
        } else {
            console.error("Unexpected webhook response format: Expected an array.", result);
            throw new Error("Unexpected webhook response format: Expected an array.");
        }
    
        // Check if we successfully extracted and concatenated HTML content
        if (finalHtmlContent) {
            showResults(finalHtmlContent);
        } else {
            console.error("No valid HTML content found or extracted from webhook response array.", result);
            throw new Error("No valid HTML content found or extracted from webhook response array.");
        }
    } catch (error) {
        console.error("Error details:", error)
        console.log("Using demo plan due to error:", error)
    
        // Show demo plan when webhook is not configured or fails
        const demoHtml = `
            <div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: system-ui, -apple-system, sans-serif; color: #1f2937;">
                <div style="background: linear-gradient(135deg, #dbeafe, #ede9fe); padding: 32px; border-radius: 16px; margin-bottom: 32px;">
                    <h1 style="font-size: 2rem; font-weight: bold; color: #1e3a8a; margin-bottom: 16px;">Your Personalized 7-Day Fitness & Nutrition Plan</h1>
                    <p style="font-size: 1.1rem; color: #1f2937; line-height: 1.6;">Hello ${surveyData.fullName}! Based on your goal of ${surveyData.goal.toLowerCase()}, we've created a comprehensive plan tailored to your needs. This plan is designed for ${surveyData.trainingDays} training days per week, using ${surveyData.equipment}.</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px;">
                    <div style="background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="font-size: 1.5rem; font-weight: 600; color: #1e40af; margin-bottom: 20px;">🏋️ Weekly Workout Plan</h2>
                        
                        <div style="margin-bottom: 24px;">
                            <h3 style="font-size: 1.2rem; color: #1e40af; margin-bottom: 12px;">Monday: Upper Body Strength</h3>
                            <ul style="list-style-type: none; padding: 0;">
                                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">• Bench Press: 4 sets x 8-10 reps</li>
                                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">• Shoulder Press: 3 sets x 10-12 reps</li>
                                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">• Lat Pulldowns: 3 sets x 12-15 reps</li>
                                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">• Tricep Dips: 3 sets x 12-15 reps</li>
                            </ul>
                        </div>

                        <div style="margin-bottom: 24px;">
                            <h3 style="font-size: 1.2rem; color: #1e40af; margin-bottom: 12px;">Wednesday: Lower Body Power</h3>
                            <ul style="list-style-type: none; padding: 0;">
                                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">• Squats: 4 sets x 8-10 reps</li>
                                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">• Romanian Deadlifts: 3 sets x 10-12 reps</li>
                                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">• Leg Press: 3 sets x 12-15 reps</li>
                                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">• Calf Raises: 3 sets x 15-20 reps</li>
                            </ul>
                        </div>

                        <div style="margin-bottom: 24px;">
                            <h3 style="font-size: 1.2rem; color: #1e40af; margin-bottom: 12px;">Friday: Full Body Circuit</h3>
                            <ul style="list-style-type: none; padding: 0;">
                                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">• Push-ups: 3 sets x 12-15 reps</li>
                                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">• Dumbbell Rows: 3 sets x 12-15 reps</li>
                                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">• Lunges: 3 sets x 12 reps each leg</li>
                                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">• Plank: 3 sets x 30-45 seconds</li>
                            </ul>
                        </div>
                    </div>

                    <div style="background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="font-size: 1.5rem; font-weight: 600; color: #5b21b6; margin-bottom: 20px;">🥗 Weekly Nutrition Plan</h2>
                        
                        <div style="margin-bottom: 24px;">
                            <h3 style="font-size: 1.2rem; color: #5b21b6; margin-bottom: 12px;">Monday - Wednesday</h3>
                            <div style="background: #f3f4f6; padding: 16px; border-radius: 12px;">
                                <p style="font-weight: 500; margin-bottom: 8px; color: #1f2937;">Breakfast:</p>
                                <p style="margin-bottom: 12px; color: #374151;">• Oatmeal with berries and nuts<br>• Greek yogurt with honey</p>
                                
                                <p style="font-weight: 500; margin-bottom: 8px; color: #1f2937;">Lunch:</p>
                                <p style="margin-bottom: 12px; color: #374151;">• Grilled chicken salad<br>• Quinoa and vegetables</p>
                                
                                <p style="font-weight: 500; margin-bottom: 8px; color: #1f2937;">Dinner:</p>
                                <p style="color: #374151;">• Baked salmon<br>• Sweet potato and steamed vegetables</p>
                            </div>
                        </div>

                        <div style="margin-bottom: 24px;">
                            <h3 style="font-size: 1.2rem; color: #5b21b6; margin-bottom: 12px;">Thursday - Sunday</h3>
                            <div style="background: #f3f4f6; padding: 16px; border-radius: 12px;">
                                <p style="font-weight: 500; margin-bottom: 8px; color: #1f2937;">Breakfast:</p>
                                <p style="margin-bottom: 12px; color: #374151;">• Protein smoothie bowl<br>• Whole grain toast with avocado</p>
                                
                                <p style="font-weight: 500; margin-bottom: 8px; color: #1f2937;">Lunch:</p>
                                <p style="margin-bottom: 12px; color: #374151;">• Turkey wrap with vegetables<br>• Brown rice and beans</p>
                                
                                <p style="font-weight: 500; margin-bottom: 8px; color: #1f2937;">Dinner:</p>
                                <p style="color: #374151;">• Lean beef stir-fry<br>• Mixed vegetables and brown rice</p>
                            </div>
                        </div>

                        <div style="background: #e0e7ff; padding: 16px; border-radius: 12px;">
                            <h4 style="font-weight: 600; color: #4f46e5; margin-bottom: 8px;">Nutrition Guidelines</h4>
                            <ul style="list-style-type: none; padding: 0; margin: 0;">
                                <li style="padding: 4px 0; color: #374151;">• Stay hydrated: 2-3 liters of water daily</li>
                                <li style="padding: 4px 0; color: #374151;">• Include protein with every meal</li>
                                <li style="padding: 4px 0; color: #374151;">• Eat 5-6 smaller meals throughout the day</li>
                                <li style="padding: 4px 0; color: #374151;">• Limit processed foods and added sugars</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 12px; margin-top: 32px;">
                    <p style="font-size: 1rem; color: #92400e; line-height: 1.6;">
                        <strong>Note:</strong> This is a sample plan based on your preferences. For a fully personalized plan with AI-powered recommendations, please ensure your webhook URL is properly configured in your .env file and run the build script. Your current preferences: ${surveyData.mealPlan} meal style, ${surveyData.restrictions || "No"} dietary restrictions, and ${surveyData.dislikes || "No"} specific dislikes.
                    </p>
                </div>
            </div>
        `;
    
        showResults(demoHtml)
    }
  }
  
  // Show results screen
  function showResults(htmlContent) {
    loadingScreen.classList.add("hidden")
    resultsContent.innerHTML = htmlContent
    resultsScreen.classList.remove("hidden")
  }
  
  // Event listeners
  prevBtn.addEventListener("click", previousStep)
  nextBtn.addEventListener("click", nextStep)
  
  // Initialize the survey when page loads
  document.addEventListener("DOMContentLoaded", initSurvey)
  