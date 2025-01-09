import { Env } from "../config/env";

export const AWS_WAF_SCRIPT_ID = "AwsWAFScript";
export const AWS_WAF_TOKEN_KEY = "x-aws-waf-token";
export const AWS_WAF_SCRIPT_LOADED_KEY = "__aws_script_loaded__";

/**
 * Charge dynamiquement le script AWS WAF.
 * @returns {Promise<object>} - Bibliothèque AWS WAF chargée.
 */
export const loadAwsWafScript = () => {
    return new Promise((resolve, reject) => {
        if (isAwsWafScriptLoaded()) {
            resolve(awsWafScriptLib());
            return;
        }

        document.getElementById(AWS_WAF_SCRIPT_ID)?.remove();
        const script = document.createElement("script");
        script.id = AWS_WAF_SCRIPT_ID;
        script.src = Env.wafJsApiUrl;

        script.onload = () => {
            window[AWS_WAF_SCRIPT_LOADED_KEY] = true;
            resolve(awsWafScriptLib());
        };

        script.onerror = (error) => {
            console.error("Erreur lors du chargement du script AWS WAF", error);
            reject(error);
        };

        document.head.appendChild(script);
    });
};

/**
 * Vérifie si le script AWS WAF est déjà chargé.
 * @returns {boolean}
 */
export const isAwsWafScriptLoaded = () => {
    return !!(window[AWS_WAF_SCRIPT_LOADED_KEY]);
};

/**
 * Renvoie l'objet de la bibliothèque AWS WAF.
 * @returns {object}
 */
export const awsWafScriptLib = () => {
    return {
        awsWafCaptcha: window.AwsWafCaptcha,
        awsWafIntegration: window.AwsWafIntegration,
    };
};

/**
 * Obtient un token AWS WAF.
 * @returns {Promise<string>} - Token AWS WAF.
 */
export const awsWafToken = async () => {
    const { awsWafIntegration } = await loadAwsWafScript();
    if (!awsWafIntegration) return "";
    return awsWafIntegration.getToken();
};
