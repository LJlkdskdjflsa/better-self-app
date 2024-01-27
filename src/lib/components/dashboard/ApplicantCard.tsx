import { DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Textarea } from '@chakra-ui/react';

import type { ApplicantModel } from '~/utils/models';

type ApplicantCardProps = {
  //   index: number;
  applicant: ApplicantModel;
};

function ApplicantCard({ applicant }: ApplicantCardProps) {
  return (
    <Box
      as="div"
      role="group"
      position="relative"
      rounded="lg"
      pl={3}
      pr={7}
      pt={3}
      pb={1}
      boxShadow="xl"
      cursor="grab"
      fontWeight="bold"
      userSelect="none"
      bgColor={applicant.color}
    >
      <IconButton
        position="absolute"
        top={0}
        right={0}
        zIndex={100}
        aria-label="Delete applicant"
        size="md"
        icon={<DeleteIcon />}
      />
      <Textarea
        value={applicant.name}
        fontWeight="semibold"
        cursor="inherit"
        border="none"
        p={0}
        resize="none"
        minH={70}
        maxH={200}
        focusBorderColor="none"
        color="gray.700"
      />
    </Box>
  );
}

export default ApplicantCard;
