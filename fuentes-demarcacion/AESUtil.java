package pe.gob.reniec.demarcacion.logic.util;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

public class AESUtil {

    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final String ALGORITHM = "AES";
    private static final int IV_LENGTH_BYTES = 12;
    private static final int TAG_LENGTH_BIT = 128;

    private AESUtil() {
        throw new IllegalStateException("Utility class");
    }

    public static String encrypt(String data, String secretKey) {
        try {
            //Convertimos CUALQUIER contraseña a un formato de 32 bytes exactos usando SHA-256
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = sha.digest(secretKey.getBytes(StandardCharsets.UTF_8));
            SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM);

            //Generamos un Vector de Inicialización (IV) aleatorio único para este cifrado
            byte[] iv = new byte[IV_LENGTH_BYTES];
            SecureRandom random = new SecureRandom();
            random.nextBytes(iv);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);

            //Inicializamos el Cipher en modo GCM
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, parameterSpec);

            byte[] encryptedBytes = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));

            // Acoplamos el IV al inicio de los bytes cifrados para transportarlo juntos
            byte[] combined = new byte[iv.length + encryptedBytes.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encryptedBytes, 0, combined, iv.length, encryptedBytes.length);

            // Retornamos la combinación completa codificada en Base64
            return Base64.getEncoder().encodeToString(combined);
        } catch (GeneralSecurityException e) {
            e.printStackTrace();
            throw new CaptchaEncryptionException("Error al encriptar el token del captcha", e);
        }
    }

    public static String decrypt(String encryptedData, String secretKey) {
        try {
            //Aplicamos la misma conversión de la clave al desencriptar
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = sha.digest(secretKey.getBytes(StandardCharsets.UTF_8));
            SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM);

            //Decodificamos el Base64 recibido
            byte[] combined = Base64.getDecoder().decode(encryptedData);

            //Extraemos el IV (los primeros 12 bytes)
            byte[] iv = new byte[IV_LENGTH_BYTES];
            System.arraycopy(combined, 0, iv, 0, iv.length);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);

            //Extraemos el texto cifrado restante (quitando el IV)
            int encryptedSize = combined.length - IV_LENGTH_BYTES;
            byte[] encryptedBytes = new byte[encryptedSize];
            System.arraycopy(combined, IV_LENGTH_BYTES, encryptedBytes, 0, encryptedSize);

            //Inicializamos el Cipher y desencriptamos
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, parameterSpec);

            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (GeneralSecurityException | IllegalArgumentException e) {
            e.printStackTrace();
            throw new CaptchaEncryptionException("Error al desencriptar el token del captcha", e);
        }
    }

    public static class CaptchaEncryptionException extends RuntimeException {
        public CaptchaEncryptionException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
