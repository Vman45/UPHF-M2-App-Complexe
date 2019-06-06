import socket
import datetime
from struct import *

# Fonction de conversion pour transformer la liste de donnees en une chaine de caracteres simple
def convert(list):
    res = ("".join(map(str, list)));
    
    return res;
    
# Adresse IP locale du RPi 
UDP_IP = "172.20.10.7"
print ("Receiver IP: ", UDP_IP)
# On ecoute le port 6000 qu'on a choisi en parametre sur l'application mobile
UDP_PORT = 6000
print ("Port: ", UDP_PORT)
sock = socket.socket(socket.AF_INET, # Internet
                     socket.SOCK_DGRAM) # UDP
sock.bind((UDP_IP, UDP_PORT))


# Changer par la position analysee pour creer le fichier d'apprentissage
position = 'stand';
log_file = 'logs/data_phone_' + position + '.txt';

while True:
    date_time = datetime.datetime.now();
    data, addr = sock.recvfrom(1024) # la taille du buffer est de 1024 bytes
    x=[]
    x.append(str(date_time));
    # On recupere ici du telephone seulement les donnees de l'accelerometre
    x.append(unpack_from ('!f', data, 0));
    x.append(unpack_from ('!f', data, 4));
    x.append(unpack_from ('!f', data, 8));
    
    # On converti la liste en chaine de caracteres
    data = convert(x) + '\n'
    
    # On ecrit dans le fichier
    try:
        file = open(log_file, 'a')
        file.write(data);
        file.close();
    except IOError:
        print('Erreur de lecture du fichier.');
    
    # Pour debug
    # print x;
