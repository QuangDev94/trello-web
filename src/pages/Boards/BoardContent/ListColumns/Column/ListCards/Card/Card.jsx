/* eslint-disable react/prop-types */
import CardMedia from "@mui/material/CardMedia"
import GroupIcon from "@mui/icons-material/Group"
import CommentIcon from "@mui/icons-material/Comment"
import AttachmentIcon from "@mui/icons-material/Attachment"
import Button from "@mui/material/Button"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { Card as MuiCard } from "@mui/material"

const Card = ({ card }) => {
  const shouldShowCardAction = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    )
  }
  return (
    <MuiCard
      sx={{
        cursor: "pointer",
        boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
        overflow: "unset",
      }}>
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}

      <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>
      {shouldShowCardAction() && (
        <CardActions sx={{ p: "0 4px 8px 4px" }}>
          {!!card?.memberIds?.length && (
            <Button startIcon={<GroupIcon />} size="small">
              {card?.memberIds?.length}
            </Button>
          )}
          {!!card?.comments?.length && (
            <Button startIcon={<CommentIcon />} size="small">
              {card?.comments?.length}
            </Button>
          )}
          {!!card?.attachments?.length && (
            <Button startIcon={<AttachmentIcon />} size="small">
              {card?.attachments?.length}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  )
}

export default Card
