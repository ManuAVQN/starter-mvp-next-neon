import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

type Props = {
  firstName: string
  resetUrl: string
}

export function ResetPasswordEmail({ firstName, resetUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Réinitialisez votre mot de passe</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 24px" }}>
          <Heading style={{ fontSize: "24px", color: "#000000", marginBottom: "16px" }}>
            Bonjour {firstName},
          </Heading>
          <Text style={{ fontSize: "16px", color: "#404040", lineHeight: "24px" }}>
            Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Réinitialiser mon mot de passe
            </Button>
          </Section>
          <Text style={{ fontSize: "14px", color: "#737373", lineHeight: "20px" }}>
            Si vous n&apos;êtes pas à l&apos;origine de cette demande, ignorez cet email. Ce lien expire dans 1 heure.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ResetPasswordEmail
