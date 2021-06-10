# LEDN Technical Interview

## Requirements
* Node v14.5.0
* NPM 6.14.5

## Compatibility
This was built solely for the `Chrome` browser.

## Setup
```
git clone https://github.com/Nathan-Larue/technical-interview-ledn.git
npm install
npm start
```

## Stack Used

### React
I decided to work with _React_ even though I never had the chance to try it out. There were three reasons behind my decision : 
1. It would allow me to know if I enjoyed programming in _React_, thus knowing if Frontend development at _Ledn_ was something that interested me;
2. Since _React_ is a technology used at _Ledn_, it would allow my reviewers to use their expertise to question my coding decisions;
3. It would give the reviewers an insight on what would be the level of quality I could deliver on my first day in terms of frontend development.

## Design Decision

### Interface
I decided to go with a design rather similar to the one the _Ledn_ app is using (vertical header to the left, content to the right), but with a dark theme / high contrast instead. For the content itself, I decided to follow the [table dark theme wireframe](https://dribbble.com/shots/6714447/attachments/6714447-Table-Dark-theme?mode=media) from [Anastasia Buksa](https://dribbble.com/buksa). The icons were taken from [IconPark](https://github.com/bytedance/IconPark), a free icon library and the font used was [Lato from Google Fonts](https://fonts.google.com/specimen/Lato?query=lato).

<br>
<img src='./src\assets\Ledn_Regular_App.png' width='500'>

_Screenshot of the Ledn app_


<img src='./src\assets\Ledn_Token_App.png' width='500'>

_Screenshot of the Ledn Token app_

### Name Search
The search looks for commonalities between three patterns: As a starting pattern inside of the first name, the last name and the full name. Furthermore, the search is not case sensitive. Here are several examples which includes the three possible patterns on the name **Mina Botrous**:

* A search using the pattern "**min**" would have returned "**Min**a Botrous";
* A search using the pattern "**botr**" would have returned "Mina **Botr**ous";
* A search using the pattern "**mina b**" would have returned "**Mina B**otrous";
* A search using the pattern "**ina**" would **not** have returned "M**ina** Botrous";

### Ordering
Ordering can be applied on the `Amount` and the `Date Created` column. Once applied, it can be toggle again to order in the opposite pattern (smaller to larger or larger to smaller). Only one sort at a time can be applied.

### Filtering
Filtering is done via a toggable pannel, in which you can individually select which filter to add / remove or if you wish to select / remove all of them.

### Libraries 
When it comes to web application, using libraries some time gives us a lot of leverage. As I wanted to work on my _React_ skills, I decided to do most of the UI component by myself. If this project would have been a more long term endeavor, I would have used libraries for flexible components such as `Datagrids` (for the table) and `Popovers` (for the filtering pannels).

## Possible Improvements

### Disabling the sort
You can switch the sorts from `Amount` to `Date Created`, but you can't disable it once it's activated, aside from refreshing the page or switching the tokens from the small to the large dataset and then one more time. 

### Tokens List Component Destructuring
The tokens list component could have been destructured more. The ordering and filtering buttons are good example of what could have been destructred even more (aside from the filtering pannels).

### Data indexing
Data indexing could have been used for filtering. It seemed a bit overkill right now as our dataset parameters that we filtered were not contained in arrays, but it would have made the whole web app more scalable for array based parameter filtering.

### Functions I/O uniformity 
My functions sometime used regular inputs, sometime they obtained data via global variables or state variables. Even though one of these options is more favorable in one case or the other, I had no default function I/O types. More uniformity in the functions setup would have made the tests setup more uniform,

### Redux for the datasets
Using a store to work with the Tokens account record would have been a more traditionnal approach.

## Testing

### Testing on large datasets
Using the `[+] Tokens` or `[-] Tokens` buttons above the table allows you to switch from a dataset from a small amount of data (the dataset provided) or a large one (a new dataset generated of 10,000 records).

### Where are the tests?
I understand that tests are extremelly important in a regular web application, but I tought it would be more relevant to give you the tough process behind **how** I would have done the tests. 

#### Unit testing
Each functions that would have an input to output behavior, either via State fetch and modification or usual inputs to return statement, would have been tested.

#### Smoke testing
Our functionality testing would have simulated user interaction with the apps by automating clicks on the different buttons, and would have compared the resulting array of ordered and filtered tokens account from the state (`filteredAndOrderedTokensList`).
