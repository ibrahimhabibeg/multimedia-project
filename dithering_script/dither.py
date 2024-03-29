import numpy as np
from PIL import Image
from math import floor
from argparse import ArgumentParser
from os import mkdir, path, getcwd

def toGrayscale(img):
    if(len(img.shape)==3):
        return (img[:,:,0] * 0.299 + img[:,:,1] * 0.587 + img[:,:,2] * 0.114).astype(np.uint8)
    else:
        return img
    
def naiveThresholdDithering(img):
    return thresholdDithering(img, 128)
    
def brightnessThresholdDithering(img):
    return thresholdDithering(img, np.average(img).astype(np.uint8))

def thresholdDithering(img, threshold):
    img = toGrayscale(np.asarray(img))
    img_new = np.empty( img.shape )
    for row in range(0, img.shape[0] ):
        for col in range(0, img.shape[1] ):
            img_new[row][col] = 0 if img[row][col] < threshold else 255
    return Image.fromarray(img_new.astype(np.uint8), mode='L').convert('1')

def errorDiffusionDithering(img):
    img = toGrayscale(np.asarray(img))
    img_new = np.empty(img.shape)
    [m, n] = img.shape
    for row in range(0, m):
        for col in range(0, n):
            img_new[row][col] = 0 if img[row][col]<128 else 255
            error = img[row][col] - img_new[row][col]
            if col + 1 <n: img[row][col+1]+=(7/16)*error
            if row + 1 < m and col - 1 >= 0: img[row+1][col-1]+=(3/16)*error
            if row + 1 < m: img[row+1][col]+=(5/16)*error
            if row + 1 < m and col + 1 < n: img[row+1][col+1]+=(1/16)*error
    return Image.fromarray(img_new.astype(np.uint8), mode='L').convert('1')

def orderedDithering(img):
    img = toGrayscale(np.asarray(img))
    img_new = np.empty( img.shape )
    D = [[0, 128, 32, 160], [192, 64, 224, 96], [48, 176, 16, 144], [240, 112, 208, 80]]
    for row in range(0, img.shape[0] ):
        for col in range(0, img.shape[1] ):
            img_new[row][col] = 0 if img[row][col] < D[row%4][col%4] else 255
    return Image.fromarray(img_new.astype(np.uint8), mode='L').convert('1')

def patternDithering(img):
    img = toGrayscale(np.asarray(img))
    img_new = np.empty( img.shape )
    [m, n] = img.shape
    PATTERNS = [
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 255, 0],
      ],
      [
        [0, 0, 255],
        [0, 0, 0],
        [0, 255, 0],
      ],
      [
        [255, 0, 255],
        [0, 0, 0],
        [0, 255, 0],
      ],
      [
        [255, 0, 255],
        [0, 0, 0],
        [255, 255, 0],
      ],
      [
        [255, 0, 255],
        [0, 0, 255],
        [255, 255, 0],
      ],
      [
        [255, 0, 255],
        [0, 0, 255],
        [255, 255, 255],
      ],
      [
        [255, 255, 255],
        [0, 0, 255],
        [255, 255, 255],
      ],
      [
        [255, 255, 255],
        [255, 0, 255],
        [255, 255, 255],
      ],
      [
        [255, 255, 255],
        [255, 255, 255],
        [255, 255, 255],
      ],
    ]

    for row in range(0, img.shape[0], 3 ):
        for col in range(0, img.shape[1], 3 ):
            sum = 0
            cnt = 0
            for i in range(row,min(m, row+3)):
                for j in range(col,min(n, col+3)):
                    sum += img[i][j]
                    cnt += 1
            D = PATTERNS[min(floor((((sum/cnt)/255)*10)), 9)]
            for i in range(row,min(m, row+3)):
                for j in range(col,min(n, col+3)):
                    img_new[i][j] = D[i-row][j-col]
    return Image.fromarray(img_new.astype(np.uint8), mode='L').convert('1')

if __name__ == "__main__":
    file_parser = ArgumentParser("dither")
    file_parser.add_argument("source", help="The image to turn black and white.")
    file_parser.add_argument("output", help="The folder to output images in.")
    file_parser.add_argument("name", help="The name for the black and white images.")
    arguments = file_parser.parse_args()
    try:
        with Image.open(arguments.source) as my_img:
            my_img = Image.open(arguments.source)
            dir = path.join(getcwd(), f'{arguments.output}')
            if not path.isdir(dir):
                mkdir(dir)
            naieve = naiveThresholdDithering(my_img).save(path.join(dir, f"{arguments.name}_naieve.png"))
            bright = brightnessThresholdDithering(my_img).save(path.join(dir, f"{arguments.name}_bright.png"))
            error = errorDiffusionDithering(my_img).save(path.join(dir, f"{arguments.name}_error.png"))
            ordered = orderedDithering(my_img).save(path.join(dir, f"{arguments.name}_ordered.png"))
            pattern = patternDithering(my_img).save(path.join(dir, f"{arguments.name}_pattern.png"))
    except IOError:
        print("Cannot read source or destination as image.")