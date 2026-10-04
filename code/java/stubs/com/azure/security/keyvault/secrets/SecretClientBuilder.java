// 编译桩：仅用于验证示例语法，对应真实依赖 com.azure:azure-security-keyvault-secrets
package com.azure.security.keyvault.secrets;

import com.azure.core.credential.TokenCredential;

public class SecretClientBuilder {
    public SecretClientBuilder vaultUrl(String vaultUrl) {
        return this;
    }

    public SecretClientBuilder credential(TokenCredential credential) {
        return this;
    }

    public SecretClient buildClient() {
        return new SecretClient();
    }
}
