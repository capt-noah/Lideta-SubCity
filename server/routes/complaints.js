import { Router } from 'express'
import pool   from '../con/db.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

function parseMediaField(val) {
  if (!val) return []
  if (Array.isArray(val)) return val
  if (typeof val === 'object' && val.name) return [val]
  return []
}

// ── Public: submit complaint ──────────────────────────────────────────────────

router.post('/', async (req, res) => {
  try {
    const d = req.body.formData || req.body
    const city = d.complainer_city || d.address_city || null
    const subcity = d.complainer_subcity || d.address_subcity || null
    const woreda = d.complainer_woreda || d.address_woreda || null
    const house = d.complainer_house_number || d.address_house_number || null

    await pool`
      INSERT INTO complaints (
        first_name, last_name, email, phone,
        complainer_city, complainer_subcity, complainer_woreda, complainer_house_number,
        complaint_subcity, complaint_woreda,
        type, status, description, photos, videos, audios,
        concerned_staff_member, user_id
      ) VALUES (
        ${d.first_name || null}, ${d.last_name || null}, ${d.email || null}, ${d.phone || ''},
        ${city}, ${subcity}, ${woreda}, ${house},
        ${d.complaint_subcity || null}, ${d.complaint_woreda || null},
        ${d.type || 'customer service'}, ${d.status || 'assigning'}, ${d.description || null},
        ${pool.json(parseMediaField(d.photos || d.photo))},
        ${pool.json(parseMediaField(d.videos || d.video))},
        ${pool.json(parseMediaField(d.audios || d.audio))},
        ${d.concerned_staff_member || null}, ${d.user_id || null}
      )`
    res.status(201).json({ message: 'Complaint submitted successfully' })
  } catch (err) {
    console.error('[complaints] Submit error:', err)
    res.status(500).json({ error: 'Failed to submit complaint' })
  }
})

// ── Public: get complaint types ───────────────────────────────────────────────

router.get('/types', async (req, res) => {
  try {
    const rows  = await pool`SELECT DISTINCT type FROM complaints WHERE type IS NOT NULL AND type != '' ORDER BY type`
    res.json(rows.map(r => r.type))
  } catch {
    res.json(['sanitation','water supply','road condition','construction','customer service','finance','public health','maintenance','service delivery'])
  }
})

// ── Admin ─────────────────────────────────────────────────────────────────────

router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const complaints = await pool`SELECT * FROM complaints`
    const counts     = await pool`
      SELECT COUNT(*) AS total,
             COUNT(*) FILTER (WHERE status IN ('assigning','in progress')) AS pending,
             COUNT(*) FILTER (WHERE status = 'resolved') AS resolved
      FROM complaints`
    const stats      = await pool`
      SELECT type AS category, COUNT(*) AS count FROM complaints GROUP BY type`

    res.json({ complaints, counts: counts[0], stats })
  } catch (err) {
    console.error('[complaints] Admin fetch error:', err)
    res.status(500).json({ error: 'Failed to fetch complaints' })
  }
})

router.post('/admin', async (req, res) => {
  try {
    const d = req.body.formData
    const result = await pool`
      INSERT INTO complaints (
        first_name, last_name, email, phone,
        complainer_city, complainer_subcity, complainer_woreda, complainer_house_number,
        complaint_subcity, complaint_woreda,
        type, status, description, photos, videos, audios,
        concerned_staff_member, user_id
      ) VALUES (
        ${d.first_name}, ${d.last_name}, ${d.email}, ${d.phone},
        ${d.address_city || null}, ${d.address_subcity || null}, ${d.address_woreda || null}, ${d.address_house_number || null},
        ${d.complaint_subcity || null}, ${d.complaint_woreda || null},
        ${d.type}, ${d.status}, ${d.description},
        ${pool.json(parseMediaField(d.photo))},
        ${pool.json(parseMediaField(d.video))},
        ${pool.json(parseMediaField(d.audio))},
        ${d.concerned_staff_member || null}, ${d.user_id || null}
      ) RETURNING complaint_id`

    const id = result[0].complaint_id
    res.status(201).json({ complaint_id: id, ref: `CPL-${String(id).padStart(5, '0')}` })
  } catch (err) {
    console.error('[complaints] Admin create error:', err)
    res.status(500).json({ error: 'Failed to create complaint' })
  }
})

router.post('/admin/update', authenticateToken, async (req, res) => {
  try {
    const d = req.body
    const city = d.address_city !== undefined ? d.address_city : (d.complainer_city !== undefined ? d.complainer_city : null)
    const subcity = d.address_subcity !== undefined ? d.address_subcity : (d.complainer_subcity !== undefined ? d.complainer_subcity : null)
    const woreda = d.address_woreda !== undefined ? d.address_woreda : (d.complainer_woreda !== undefined ? d.complainer_woreda : null)
    const house = d.address_house_number !== undefined ? d.address_house_number : (d.complainer_house_number !== undefined ? d.complainer_house_number : null)

    const photos = d.photo !== undefined ? d.photo : (d.photos !== undefined ? d.photos : [])
    const videos = d.video !== undefined ? d.video : (d.videos !== undefined ? d.videos : [])
    const audios = d.audio !== undefined ? d.audio : (d.audios !== undefined ? d.audios : [])

    await pool`
      UPDATE complaints SET
        first_name               = ${d.first_name || null},
        last_name                = ${d.last_name || null},
        email                    = ${d.email || null},
        phone                    = ${d.phone || ''},
        complainer_city          = ${city},
        complainer_subcity       = ${subcity},
        complainer_woreda        = ${woreda},
        complainer_house_number  = ${house},
        complaint_subcity        = ${d.complaint_subcity || null},
        complaint_woreda         = ${d.complaint_woreda || null},
        type                     = ${d.type || 'customer service'},
        status                   = ${d.status || 'assigning'},
        description              = ${d.description || null},
        photos                   = ${pool.json(parseMediaField(photos))},
        videos                   = ${pool.json(parseMediaField(videos))},
        audios                   = ${pool.json(parseMediaField(audios))},
        concerned_staff_member   = ${d.concerned_staff_member || null}
      WHERE complaint_id = ${d.id}`

    res.json({ message: 'Complaint updated successfully' })
  } catch (err) {
    console.error('[complaints] Admin update error:', err)
    res.status(500).json({ error: 'Failed to update complaint' })
  }
})

router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await pool`DELETE FROM complaints WHERE complaint_id = ${id}`
    res.json({ message: 'Complaint deleted successfully' })
  } catch (err) {
    console.error('[complaints] Delete error:', err)
    res.status(500).json({ error: 'Failed to delete complaint' })
  }
})

export default router
