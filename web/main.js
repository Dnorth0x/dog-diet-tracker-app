// Initial HTML for the form, to be injected
const formHTML = `
  <div class="md:col-span-2">
    <label for="dog-name" class="block text-sm font-medium text-brand-muted mb-2">Dog's Name</label>
    <input type="text" id="dog-name" name="dog-name" required class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-brand-light focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition">
  </div>
  <div>
    <label for="meal-type" class="block text-sm font-medium text-brand-muted mb-2">Meal Type</label>
    <input type="text" id="meal-type" name="meal-type" placeholder="e.g., Breakfast" required class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-brand-light focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition">
  </div>
  <div>
    <label for="quantity" class="block text-sm font-medium text-brand-muted mb-2">Quantity (grams)</label>
    <input type="number" id="quantity" name="quantity" required class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-brand-light focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition">
  </div>
  <div class="md:col-span-2">
    <label for="food-description" class="block text-sm font-medium text-brand-muted mb-2">Food Description</label>
    <textarea id="food-description" name="food-description" rows="3" required class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-brand-light focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"></textarea>
  </div>
  <div class="md:col-span-2 text-right">
    <button type="submit" class="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 shadow-lg">Add Meal Log</button>
  </div>
`;

document.querySelector('#diet-form').innerHTML = formHTML;

const form = document.getElementById('diet-form');
const logEntriesContainer = document.getElementById('log-entries');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const dogName = document.getElementById('dog-name').value;
  const mealType = document.getElementById('meal-type').value;
  const quantity = document.getElementById('quantity').value;
  const foodDescription = document.getElementById('food-description').value;

  const newEntryElement = document.createElement('div');
  newEntryElement.className = 'log-entry bg-brand-medium p-5 rounded-lg shadow-lg grid grid-cols-3 gap-4 items-center transition-all duration-500 transform opacity-0 translate-y-4';
  newEntryElement.innerHTML = `
    <div>
      <h3 class="font-bold text-lg text-brand-light">${dogName}</h3>
      <p class="text-sm text-brand-muted">${mealType}</p>
    </div>
    <div class="col-span-2">
      <p class="text-brand-light">${foodDescription}</p>
    </div>
    <div class="col-span-3 text-right text-sm text-brand-muted border-t border-gray-700 pt-2 mt-2">
      <span>${quantity} grams</span>
    </div>
  `;
  
  logEntriesContainer.prepend(newEntryElement);

  requestAnimationFrame(() => {
    newEntryElement.classList.remove('opacity-0', 'translate-y-4');
  });

  form.reset();
});