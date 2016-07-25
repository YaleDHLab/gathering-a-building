import subprocess

subprocess.call('aws s3 cp ../gathering-a-building s3://gathering-a-building-deploy --recursive --exclude=".git*" --exclude="README.md" --exclude="deploy.py"', shell=True)
