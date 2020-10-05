# Doing execfile() on this file will alter the current interpreter's
# environment so you can import libraries in the virtualenv
def activate():
    import os
    this_file = "WordCloudEnv/Scripts/activate_this.py"
    exec(open(this_file).read(), {'__file__': this_file})