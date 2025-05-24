'use client';

import { useSearchParams } from 'next/navigation';
import { Container, Typography, Box, Stack, IconButton } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkIcon from '@mui/icons-material/Link';
import Footer from '../win-a-car/components/Footer';
import Navbar from '../win-a-car/components/Navbar';
import Image from 'next/image';
import ParticipationImage from '@public/referral-illustration.webp';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'ABC12345';
  const referralCode = searchParams.get('referralCode') || token;
  const supermarket = searchParams.get('supermarket') || 'Supermarket --------';
  const referralUrl = `https://tusorteo.com/win-a-car?token=${token}`;

  const share = (platform: string) => {
    const text = `¡Regístrate con mi código y gana más oportunidades de participar! Código: ${referralCode} 👉 ${referralUrl}`;
    const encodedText = encodeURIComponent(text);

    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        referralUrl
      )}`,
      instagram: `https://www.instagram.com`, // Instagram no tiene un share directo por URL
      link: referralUrl,
    };

    if (platform === 'link') {
      navigator.clipboard.writeText(referralUrl);
      alert('Link copiado al portapapeles');
    } else {
      window.open(urls[platform], '_blank');
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: '#fff', pb: 6 }}>
        <Container maxWidth="sm">
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: 4,
              mt: 12,
              boxShadow: 3,
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" sx={{ color: '#ff4b9b' }} fontWeight={700}>
              Thank you for participating!
            </Typography>
            <Typography variant="body1" mt={1}>
              Your registration with <b>{supermarket}</b> was successful!
            </Typography>

            <Typography variant="body1" mt={4}>
              Your referral code is:
            </Typography>
            <Typography
              variant="h6"
              fontWeight={700}
              color="#000"
              sx={{ background: '#f1f1f1', borderRadius: 2, py: 1, my: 1 }}
            >
              {referralCode}
            </Typography>

            <Typography variant="subtitle1" fontWeight={700} mt={4}>
              Share it with your friends and increase your chances of winning:
            </Typography>
            <Typography variant="body2" mt={1}>
              • For each friend who completes their registration with your code,
              you’ll get 1 additional entry.
            </Typography>
            <Typography variant="body2">
              • The more referrals, the closer you are to the wheel!
            </Typography>

            <Box my={0}>
              <Image 
                src={ParticipationImage.src}
                alt="Thank You"
                width={422}
                height={445}
                style={{ borderRadius: '8px',maxWidth: '100%',height: 'auto' }}
              />
            </Box>

            <Typography variant="subtitle1" fontWeight={700}>
              How to share?
            </Typography>
            <Typography variant="body2" mt={1}>
              • Copy your unique link and send it via WhatsApp
            </Typography>
            <Typography variant="body2">
              • Share on Facebook, Instagram, or email
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
              <IconButton
                onClick={() => share('whatsapp')}
                sx={{ bgcolor: '#25D366', color: '#fff' }}
              >
                <WhatsAppIcon />
              </IconButton>
              <IconButton
                onClick={() => share('facebook')}
                sx={{ bgcolor: '#3b5998', color: '#fff' }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                onClick={() => share('instagram')}
                sx={{ bgcolor: '#E1306C', color: '#fff' }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                onClick={() => share('link')}
                sx={{ bgcolor: '#000', color: '#fff' }}
              >
                <LinkIcon />
              </IconButton>
            </Stack>

            <Typography
              variant="body1"
              mt={4}
              sx={{ color: '#ff4b9b', fontWeight: 700 }}
            >
              Good luck and thanks for being part of Sweepstouch!
            </Typography>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
