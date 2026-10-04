// 编译桩：仅用于验证示例语法，对应真实依赖 com.azure:azure-security-keyvault-secrets
package com.azure.security.keyvault.secrets;

import com.azure.security.keyvault.secrets.models.KeyVaultSecret;

public class SecretClient {
    SecretClient() {
    }

    public KeyVaultSecret getSecret(String name) {
        throw new UnsupportedOperationException("编译桩");
    }
}
