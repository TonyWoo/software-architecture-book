package ch100;

import com.azure.identity.DefaultAzureCredential;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;
import org.springframework.stereotype.Component;

// 最小权限 + 密钥管理：只引用 Key Vault 的地址，应用用托管身份认证。
// 代码和配置文件里没有任何密钥、连接串、凭证。
class SecurityLeastPrivilegeAndSecrets01 {

    @Component
    static class PaymentSecrets {
        private final SecretClient vault;

        PaymentSecrets() {
            this.vault = new SecretClientBuilder()
                .vaultUrl("https://myapp-kv.vault.azure.net/")
                .credential(new DefaultAzureCredential())
                .buildClient();
        }

        String apiKey() {
            // 值在运行时从 vault 解析，从不落盘到任何文件。
            return vault.getSecret("Payments-ApiKey").getValue();
        }
    }

    // 最小权限三问（每次接外部资源时问一遍）：
    // 1. 这个身份真的需要这个权限吗？（读密钥不等于写密钥）
    // 2. 权限能再收窄吗？（按 vault、按 secret 名、按时间）
    // 3. 凭证泄漏了 blast radius 有多大？（托管身份无密码可泄）
}
