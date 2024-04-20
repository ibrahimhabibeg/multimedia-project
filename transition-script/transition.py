import numpy as np
from PIL import Image
from argparse import ArgumentParser
from os import mkdir, path, getcwd

NUMBER_IMAGES = 50
DURATION = 30
    
def createCrossImage(source, destination, alpha):
    return Image.fromarray(((1-alpha)*source + alpha*destination).astype(np.uint8))
    
def crossDissolve(source, destination):
    source_arr = np.asarray(source)
    destination_arr = np.asanyarray(destination)
    return [createCrossImage(source_arr, destination_arr, i/NUMBER_IMAGES) for i in range(NUMBER_IMAGES+1)]
    
def createDitherImage(source, destination, alpha):
    cols_from_first = int(source.shape[1] * alpha)
    img_new = np.concatenate((destination[:, :cols_from_first], source[:, cols_from_first:]), axis=1)
    return Image.fromarray(img_new.astype(np.uint8))
    
def ditherDissolve(source, destination):
    source_arr = np.asarray(source)
    destination_arr = np.asanyarray(destination)
    return [createDitherImage(source_arr, destination_arr, i/NUMBER_IMAGES) for i in range(NUMBER_IMAGES+1)]
    

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
            img2 = img2.resize((img1.width, img1.height))
            cross = crossDissolve(img1, img2)
            dither = ditherDissolve(img1, img2)
            cross[0].save(path.join(dir, f"{arguments.name}_cross.gif"), save_all=True, append_images=cross[1:], duration=DURATION, loop=0)
            dither[0].save(path.join(dir, f"{arguments.name}_dither.gif"), save_all=True, append_images=dither[1:], duration=DURATION, loop=0)
    except IOError:
        print("Cannot read source or destination as image.")