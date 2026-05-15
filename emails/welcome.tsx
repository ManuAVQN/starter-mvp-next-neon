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
  dashboardUrl: string
}

export function WelcomeEmail({ firstName, dashboardUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Votre compte est actif</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 24px" }}>
          <Heading style={{ fontSize: "24px", color: "#000000", marginBottom: "16px" }}>
            Votre compte est actif, {firstName}
          </Heading>
          <Text style={{ fontSize: "16px", color: "#404040", lineHeight: "24px" }}>
            Votre adresse email a été vérifiée. Vous pouvez désormais accéder à votre espace.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={dashboardUrl}
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
              Accéder à mon espace
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail
