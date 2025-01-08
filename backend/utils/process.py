import subprocess
import requests
import psutil


def kill(proc_pid):
    process = psutil.Process(proc_pid)
    for proc in process.children(recursive=True):
        proc.kill()
    process.kill()

FRONTEND_DIRECTORY = ""

def run_npm_command(command):
    process = subprocess.Popen(
        command,
        cwd=FRONTEND_DIRECTORY,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1
    )

    access = False
    while not access:
        try:
            print('Acessando o frontend...')

            response = requests.get("http://localhost:3000/login")
            if response.status_code == 200:
                access = True
        except BaseException:
            print('Erro ao acessar o frontend')

    return process

def build_frontend():
    print("Iniciando npm run build...")
    run_npm_command(["npm", "run", "build"])

def start_frontend():
    print("Iniciando npm run start...")
    return run_npm_command(["npm", "run", "start"])

try:
    build_frontend()
    process = start_frontend()
    kill(process.pid)

except KeyboardInterrupt:
    print("Interrompido pelo usuário.")