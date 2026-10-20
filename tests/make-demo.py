from pathlib import Path
from PIL import Image
import subprocess
import imageio_ffmpeg
files=sorted(Path('docs/frames').glob('*.png'))
if len(files)!=120:
    raise SystemExit(f'Expected 120 frames, found {len(files)}')
frames=[Image.open(f).convert('RGB').resize((800,500),Image.Resampling.LANCZOS) for f in files]
frames[0].save('docs/demo.gif',save_all=True,append_images=frames[1:],duration=100,loop=0,optimize=False)
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-framerate','10','-i','docs/frames/%04d.png','-c:v','libx264','-pix_fmt','yuv420p','-crf','22','-movflags','+faststart','docs/demo.mp4'],check=True)
with Image.open('docs/demo.gif') as im:
    print('GIF:', im.n_frames, 'frames,',sum((im.seek(i),im.info.get('duration',0))[1] for i in range(im.n_frames))/1000,'seconds')
