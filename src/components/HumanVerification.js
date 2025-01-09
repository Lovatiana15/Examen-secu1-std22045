import React, { useEffect, useRef } from "react";
import { Dialog, DialogContent, CircularProgress, Box } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadAwsWafScript } from "../utils/wafUtils";
import { Env } from "../config/env";

export const HumanVerification = ({ onSuccess }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const redirectTo =
        "/?current=" + searchParams.get("current") + "&maxCount=" + searchParams.get("maxCount");

    const captchaContainerRef = useRef(null);
    const captchaRef = useRef(null);
    const isCaptchaOpen = useRef(false);

    const renderCaptcha = async () => {
        const { awsWafCaptcha } = await loadAwsWafScript();

        if (isCaptchaOpen.current) {
            return Promise.resolve(undefined);
        }

        isCaptchaOpen.current = true;

        return new Promise((resolve) => {
            captchaRef.current?.firstElementChild?.remove();
            awsWafCaptcha.renderCaptcha(captchaRef.current, {
                apiKey: Env.wafApiKey,
                onSuccess: (token) => {
                    isCaptchaOpen.current = false;
                    navigate(redirectTo); // Optionnel : redirige après la validation
                    resolve(token);
                    onSuccess(); // Signale que le CAPTCHA a été validé avec succès
                },
            });
        });
    };

    useEffect(() => {
        renderCaptcha();
    }, []);

    return (
        <Dialog open fullWidth maxWidth="sm" ref={captchaContainerRef}>
            <DialogContent>
                <Box
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                    data-testid="aws-waf-captcha-dialog"
                    ref={captchaRef}
                >
                    <CircularProgress />
                </Box>
            </DialogContent>
        </Dialog>
    );
};
