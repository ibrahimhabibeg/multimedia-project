import numpy as np
from PIL import Image
from argparse import ArgumentParser
from os import mkdir, path, getcwd

NUMBER_IMAGES = 50
DURATION = 30
    
def createCrossImage(source, destination, alpha):
    source = np.asarray(source)
    destination = np.asarray(destination)
    img_new = np.empty( source.shape )
    for row in range(0, source.shape[0] ):
        for col in range(0, source.shape[1] ):
            for color in range(0, source.shape[2] ):
                img_new[row][col][color] = (1-alpha)*source[row][col][color] + alpha*destination[row][col][color]
    return Image.fromarray(img_new.astype(np.uint8))
    
def crossDissolve(source, destination):
    images = []
    images.append(source)
    for i in range(1, NUMBER_IMAGES+1):
        images.append(createCrossImage(source, destination, i/NUMBER_IMAGES))
    return images
    
def createDitherImage(source, destination, alpha):
    source = np.asarray(source)
    destination = np.asarray(destination)
    img_new = np.copy(source)
    for row in range(0, source.shape[0] ):
        for col in range(0, int(source.shape[1] * alpha)):
            for color in range(0, source.shape[2] ):
                img_new[row][col][color] = destination[row][col][color]
    return Image.fromarray(img_new.astype(np.uint8))
    
def ditherDissolve(source, destination):
    images = []
    images.append(source)
    for i in range(1, NUMBER_IMAGES+1):
        images.append(createDitherImage(source, destination, i/NUMBER_IMAGES))
    return images
    

if __name__ == "__main__":
    file_parser = ArgumentParser("transition")
    file_parser.add_argument("source", help="The source image.")
    file_parser.add_argument("destination", help="The destination image.")
    file_parser.add_argument("output", help="The folder to output gif in.")
    file_parser.add_argument("name", help="The name for the gif.")
    arguments = file_parser.parse_args()
    try:
        with Image.open(arguments.source) as img1, Image.open(arguments.destination) as img2:
            dir = path.join(getcwd(), f'{arguments.output}')
            if not path.isdir(dir):
                mkdir(dir)
            cross = crossDissolve(img1, img2)
            dither = ditherDissolve(img1, img2)
            cross[0].save(path.join(dir, f"{arguments.name}_cross.gif"), save_all=True, append_images=cross[1:], duration=DURATION, loop=0)
            dither[0].save(path.join(dir, f"{arguments.name}_dither.gif"), save_all=True, append_images=dither[1:], duration=DURATION, loop=0)
    except IOError:
        print("Cannot read source or destination as image.")