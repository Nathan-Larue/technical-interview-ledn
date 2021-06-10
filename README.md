# LEDN Technical Interview

## Requirements
* Node v14.5.0
* NPM 6.14.5

## Compatibility
* This was built solely for the `Chrome` browser
* Supported on Windows & Mac computers

## Setup
```
git clone https://github.com/Nathan-Larue/technical-interview-ledn.git
cd .\technical-interview-ledn\
npm install
npm start
```

## Stack Used

### React
I decided to work with _React_ even though I never had the chance to try it out. There were three reasons behind my decision : 
1. It would allow me to know if I enjoyed programming in _React_, thus knowing if Frontend development at _Ledn_ was something that interested me;
2. Since _React_ is a technology used at _Ledn_, it would allow my reviewers to use their expertise to question my coding decisions;
3. It would give the reviewers an insight on what would be the level of quality I could deliver on my first day in terms of Frontend development.

## Design Decision

### Interface
I decided to go with a design rather similar to the one the _Ledn_ app is using (vertical header to the left, content to the right), but with a dark theme / high contrast approach instead. For the content itself, I decided to follow the [table dark theme wireframe](https://dribbble.com/shots/6714447/attachments/6714447-Table-Dark-theme?mode=media) from [Anastasia Buksa](https://dribbble.com/buksa). The icons were taken from [IconPark](https://github.com/bytedance/IconPark), a free icon library and the font used was [Lato from Google Fonts](https://fonts.google.com/specimen/Lato?query=lato).

<br>
<img src='./src\assets\Ledn_Regular_App.png' width='500'>

_Screenshot of the Ledn app_


<img src='./src\assets\Ledn_Token_App.png' width='500'>

_Screenshot of the Ledn Token app_

### Name Search
The search looks for commonalities between three patterns: As a starting pattern inside of the first name, the last name, and the full name. Furthermore, the search is not case-sensitive. Here are several examples which include the three possible patterns on the name **Mina Botrous**:

* A search using the pattern "**min**" would have returned "**Min**a Botrous";
* A search using the pattern "**botr**" would have returned "Mina **Botr**ous";
* A search using the pattern "**mina b**" would have returned "**Mina B**otrous";
* A search using the pattern "**ina**" would **not** have returned "M**ina** Botrous";

### Ordering
Ordering can be applied to the `Amount` and the `Date Created` column. Once applied, it can be toggled again to order in the opposite pattern (smaller to larger or larger to smaller). Only one sort at a time can be applied.

### Filtering
Filtering is done via a togglable panel, in which you can individually select which filter to add/remove or if you wish to select/remove all of them.

### Libraries 
When it comes to web applications, using libraries gives us a lot of leverage in terms of efficiency. As I wanted to work on my _React_ skills, I decided to do most of the UI components by myself. If this project would have been a more long-term endeavor, I would have used libraries for flexible components such as `Datagrids` (for the table) and `Popovers` (for the filtering panels).

## Possible Improvements

### Disabling the sort
You can switch the sorts from `Amount` to `Date Created`, but you can't disable it once it's activated, aside from refreshing the page or changing the dataset. 

### Tokens List Component Destructuring
The tokens list component could have been destructured more. The ordering and filtering buttons are good examples of what could have been destructured even more (aside from the filtering panels) into _React_ components.

### Data indexing
Data indexing could have been used for filtering. It seemed a bit overkill right now as the dataset parameters that we filtered were not contained in arrays, but it would have made the whole web app more scalable for array-based parameter filtering.

### Functions I/O uniformity 
My functions sometimes used regular inputs, sometime they obtained data via global variables or state variables. Even though one of these options is more favorable in one case or the other, I had no default I/O approach. More uniformity in the functions usually makes for more readability and faster test production (as the same approach can usually be repeated).

### Redux for the datasets
Using a store to work with the Tokens account record would have been a more traditional approach, but it seemed unnecessary for the current scope.

## Testing

### Testing on large datasets
Using the `[+] Tokens` or `[-] Tokens` buttons above the table allows you to switch from a small dataset (the dataset provided, also known as `accounts.json`) or a large one (a new dataset generated of 10,000 records, also known as `accounts_large.json`).

### Where are the tests?
I understand that tests are extremely important in a regular web application, but I thought it would be more relevant to give you my thought process behind **how** I would have done the tests instead. 

#### Unit testing
Here is how I would have proceeded for unit testing on IO oriented functions:
1. Setup a mock state in which we want to test the function;
2. Setup the data that is required by the function to execute (either via passing variables to the function or editing the state);
3. Compared to results (either returned by the function or by looking at the edited component state) to an expected output.

**e.g: Testing the isTokenNameValid(TokenItem)**
1. I would have built a TokenItem with the `First Name` and `Last Name` parameters to be `Mina` and `Botrous` respectively;
2. I would have set the `TokensList` component state parameter called `searchValue` to all the possible *happy paths* (following the process [explained previously here](https://github.com/Nathan-Larue/technical-interview-ledn#name-search));
3. Would have expected either `True` or `False` for each of the `searchValue` appropriate response;
4. Would have repeated the process with edge cases, such as `undefined` or `null` parameters, and would have added case-sensitive tests to see if the results were the same.


#### Smoke testing
Our functionality testing would have simulated user interaction with the apps by automating clicks on the different buttons and would have compared the resulting array of ordered and filtered tokens account from the state (`filteredAndOrderedTokensList`).

**e.g: Testing the search input data propagation**
1. Automate an interaction with the search input and add a given string to it;
2. Look if the `onSearchChange` was called at least one time (depending on the automation tool, it might be called more than once to simulate user interactions);
3. Look if `TokensPage` state did update with the appropriate value on the `searchValue` parameter;
4. Look if following the change in the `TokensPage` state, the `componentDidUpdate()` function was triggered inside of the `TokensList` component;
5. Look if the `TokensList` state parameter called `searchValue` has changed to the appropriate value.
