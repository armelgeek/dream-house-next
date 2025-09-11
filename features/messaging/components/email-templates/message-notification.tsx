import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface MessageNotificationEmailProps {
  recipientName: string;
  senderName: string;
  message: string;
  propertyTitle?: string;
  dashboardUrl: string;
}

export const MessageNotificationEmail = ({
  recipientName,
  senderName,
  message,
  propertyTitle,
  dashboardUrl,
}: MessageNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      New message from {senderName} on Dream House
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://res.cloudinary.com/your-cloud/image/upload/v1/dream-house-logo.png`}
          width="170"
          height="50"
          alt="Dream House"
          style={logo}
        />
        <Text style={paragraph}>Hi {recipientName},</Text>
        <Text style={paragraph}>
          You have received a new message from <strong>{senderName}</strong> on Dream House.
        </Text>
        
        {propertyTitle && (
          <Text style={paragraph}>
            <strong>Property:</strong> {propertyTitle}
          </Text>
        )}
        
        <Section style={messageContainer}>
          <Text style={messageText}>&ldquo;{message}&rdquo;</Text>
        </Section>
        
        <Section style={btnContainer}>
          <Button style={button} href={dashboardUrl}>
            View Message
          </Button>
        </Section>
        
        <Text style={paragraph}>
          You can reply to this message by visiting your dashboard on Dream House.
        </Text>
        
        <Hr style={hr} />
        <Text style={footer}>
          This email was sent because you have an account on Dream House. If you no longer wish to receive these notifications, you can update your preferences in your account settings.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const messageContainer = {
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
  padding: '16px',
  margin: '16px 0',
};

const messageText = {
  fontSize: '14px',
  lineHeight: '24px',
  fontStyle: 'italic',
  margin: '0',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '3px',
  color: '#ffffff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};