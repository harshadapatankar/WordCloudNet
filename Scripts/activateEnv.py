# Doing execfile() on this file will alter the current interpreter's
# environment so you can import libraries in the virtualenv
def activate():
    import os
    from sys import platform
    this_file = os.path.dirname(os.path.abspath(__file__))
    if platform == "linux" or platform == "linux2" or platform == "darwin":
        this_file += "/wordCloudEnv/bin/activate_this.py"
    elif platform == "win32":
        this_file += "/wordCloudEnv/Scripts/activate_this.py"
    exec(open(this_file).read(), {'__file__': this_file})