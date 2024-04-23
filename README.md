# Multimedia Course Project

This project explores different image manipulation techniques in Python and implements a user interface for applying them through a React website.

## Live Website Link:
https://multimedia-project.onrender.com/

## Project Goal:

Convert color images to monochrome using various dithering algorithms.
Create smooth transitions between two images using a dissolve effect.

## Project Structure:

- images: This folder contains sample color images used for testing purposes.
- dithering-script:
    - dither.py: This Python script implements functions for applying different dithering algorithms to images and converting them to monochrome.
        - The script includes a help function accessible using python3 dither.py -h.
    - sample_result: This folder contains sample monochrome images generated using the dithering script.
- transition_script:
    - transition.py: This Python script implements a function for creating a smooth transition (dissolve effect) between two images.
        - Similar to dither.py, this script includes a help function accessible using python3 transition.py -h.
    - sample_result: This folder contains sample gif generated using the transition script.
- website:
    - This folder contains the source code for a React application built with Vite and Typescript.
    - This website allows users to upload an image and choose a dithering algorithm to convert it to monochrome.
    - The website also integrates with Docker for containerized deployment.
## Running the Project:

### Dithering Script:

Open a terminal in the dithering-script folder.

Run the script with the following command (replace arguments with your desired values):

`
python3 dither.py ../images/scu.jpg ./sample_result scu
`

- ../images/scu.jpg: Path to the color image you want to convert.
- ./sample_result: Folder path for saving the output monochrome image.
- scu: Name for the output monochrome image (without extension).
### Transition Script:

Open a terminal in the transition_script folder.


Run the script with the following command (replace arguments with your desired values):
`
python3 transition.py ../images/tea_square.jpg ../images/coffee_square.jpg
`
- sample_result tea_coffee
- ../images/tea_square.jpg: Path to the first image in the transition.
- ../images/coffee_square.jpg: Path to the second image in the transition.
- sample_result: Folder path for saving the output transition GIF.
- tea_coffee: Name for the output transition GIF (without extension).

### Website (Requires additional setup):

Option 1: Using Docker

- Build the Docker image from the base file in the website folder following the instructions provided there.  
`
docker build -t multimedia .
`

- Run the container and map the container port (80) to your host machine's port (usually 3000).  
`
docker run --name multimedia -p 3000:80 -d --rm multimedia
`

Option 2: Using Node.js (without Docker)

- Navigate to the website folder in your terminal.
- Install dependencies:  
`
npm install
`
- Start the development server:  
`
npm run dev
`
- This will start the website at http://localhost:5173/ (or a different port if specified) for live development.
- Build the website for production:  
`
npm run build
`  
This will create an optimized production build in the website/dist folder.

## Additional Notes:

- Ensure you have Python installed on your system to run the scripts.


## Acknowledgments

I would like to thank Dr. Osama Farouk for his guidance and support throughout this project. His lectures and feedback were invaluable in helping me understand the concepts and complete this project successfully.