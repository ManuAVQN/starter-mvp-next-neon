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
  verificationUrl: string
}

export function VerificationEmail({ firstName, verificationUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Vérifiez votre adresse email</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 24px" }}>
          <Heading style={{ fontSize: "24px", color: "#000000", marginBottom: "16px" }}>
            Bienvenue, {firstName}
          </Heading>
          <Text style={{ fontSize: "16px", color: "#404040", lineHeight: "24px" }}>
            Merci de vous être inscrit. Pour activer votre compte, confirmez votre adresse email en cliquant sur le bouton ci-dessous.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={verificationUrl}
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
              Vérifier mon adresse email
            </Button>
          </Section>
          <Text style={{ fontSize: "14px", color: "#737373", lineHeight: "20px" }}>
            Si vous n&apos;avez pas créé de compte, ignorez cet email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default VerificationEmail
